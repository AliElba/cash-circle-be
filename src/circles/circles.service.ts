import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCircleDto, UpdateCircleDto } from './dto/circle.dto';

import { CircleStatus, MemberStatus, PaymentStatus, User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { MemberDto } from './dto/member.dto';

@Injectable()
export class CirclesService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService
  ) {}

  /**
   * Create a new circle and optionally add members.
   *
   * This method performs the following steps:
   * 1. Creates a new circle with the provided data.
   * 2. If members are provided, it adds each member to the newly created circle.
   * 3. All operations are performed within a transaction to ensure atomicity.
   *
   * @param data - The data required to create a new circle, including optional members.
   * @returns The created circle along with any added members.
   * @throws BadRequestException if there is an error during the creation process.
   */
  async createCircle(data: CreateCircleDto) {
    try {
      const { members, ...rest } = data;

      // Step 1: Create the circle inside the transaction
      const circle = await this.prisma.circle.create({
        data: { ...rest },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      // Step 2: Add members inside the transaction
      if (members && members.length > 0) {
        for (const member of members) {
          await this.addMemberToCircle(circle.id, member);
        }
      }

      return circle;
    } catch (error) {
      throw new BadRequestException(`Error creating circle and adding members: ${(error as { message: string }).message}`);
    }
  }

  /**
   * Get all circles with members and owner.
   */
  async getAllCircles() {
    return this.prisma.circle.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  /**
   * Get all user circles with members and owner.
   */
  async getAllUserCircles(userId: string, status?: CircleStatus) {
    return this.prisma.circle.findMany({
      where: {
        // Optional filter sent as a query params
        ...(status && { status }),
        members: {
          // Get only circles where the current user is a member
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  /**
   * Get a single circle by ID with members and owner details.
   */
  async getCircleById(id: string) {
    const circle = await this.prisma.circle.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!circle) {
      throw new BadRequestException('Circle not found');
    }

    return circle;
  }

  async updateCircle(id: string, updateCircleDto: UpdateCircleDto) {
    // Fetch existing members for comparison
    const existingMembers = await this.prisma.circleMember.findMany({
      where: { circleId: id },
      select: { id: true, userId: true },
    });

    const newMembers = updateCircleDto.members || [];

    // Step 1: Identify members to REMOVE (exist in DB but not in the new list)
    const membersToRemove = existingMembers.filter(
      (existing) => !newMembers.some((newMember) => newMember.userId === existing.userId)
    );

    // Step 2: Identify members to ADD (exist in new list but not in DB)
    const membersToAdd = newMembers.filter(
      (newMember) => !existingMembers.some((existing) => existing.userId === newMember.userId)
    );

    // Step 3: Identify members to UPDATE (exist in both lists)
    const membersToUpdate = newMembers.filter((newMember) =>
      existingMembers.some((existing) => existing.userId === newMember.userId)
    );

    // Step 4: Perform Prisma Transactions to apply changes efficiently
    return this.prisma.$transaction(async (prisma) => {
      // Remove members not in the new list
      if (membersToRemove.length > 0) {
        await prisma.circleMember.deleteMany({
          where: { id: { in: membersToRemove.map((m) => m.id) } },
        });
      }

      // Update existing members
      for (const member of membersToUpdate) {
        await prisma.circleMember.update({
          where: { id: member.id },
          data: {
            status: member.status || MemberStatus.PENDING,
            slotNumber: member.slotNumber,
            paymentStatus: member.paymentStatus || PaymentStatus.PENDING,
            payoutDate: member.payoutDate,
            adminFees: member.adminFees,
          },
        });
      }

      // Add new members
      for (const member of membersToAdd) {
        await this.addMemberToCircle(id, member);
      }

      // Step 5: Update the circle's main fields
      const isAllMembersConfirmed = updateCircleDto.members?.every((member) => member.status === MemberStatus.CONFIRMED);

      return prisma.circle.update({
        where: { id },
        data: {
          name: updateCircleDto.name,
          amount: updateCircleDto.amount,
          duration: updateCircleDto.duration,
          startDate: updateCircleDto.startDate,
          endDate: updateCircleDto.endDate,
          status: isAllMembersConfirmed ? CircleStatus.ACTIVE : CircleStatus.PENDING,
        },
      });
    });
  }

  /**
   * Delete a circle by ID.
   */
  async deleteCircle(id: string) {
    try {
      return this.prisma.circle.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(`Error deleting circle: ${(error as { message: string }).message}`);
    }
  }

  /**
   * Add a member to a circle.
   *
   * 1. If userId is provided:
   *    • Directly fetch the user by their ID.
   *    • If the user is found, proceed to add them to the circle.
   * 2. If only phone is provided:
   *    • Check if the user exists by their phone.
   *    • If not, create a new unregistered user.
   * 3. If neither userId nor phone is provided:
   *    • Throw a BadRequestException.
   * 4. Validate slot availability before adding the user to the circle.
   */
  async addMemberToCircle(circleId: string, memberData: MemberDto) {
    let user: User | null = null;

    // Ensure either userId or phone exists
    if (!memberData.userId && !memberData.phone) {
      throw new BadRequestException('Each member must have a userId or phone number.');
    }

    // Step 1: Handle userId if provided
    if (memberData.userId) {
      user = await this.prisma.user.findUnique({ where: { id: memberData.userId } });

      if (!user) {
        throw new BadRequestException('User not found with the provided userId.');
      }
    }

    // Step 2: Handle phone if userId is not provided
    if (!user && memberData.phone) {
      user = await this.prisma.user.findUnique({ where: { phone: memberData.phone } });

      if (!user) {
        // Create an unregistered user if no user exists with the provided phone
        user = await this.userService.createUnregisteredUser({ phone: memberData.phone });
      }
    }

    if (!user) {
      throw new BadRequestException('Either userId or phone must be provided.');
    }

    // Step 3: Check if the user is already a member of the circle
    const existingMember = await this.prisma.circleMember.findFirst({
      where: { circleId, userId: user.id },
    });

    if (existingMember) {
      throw new BadRequestException('This user is already a member of the circle.');
    }

    // Step 4: Check if the slot number is already reserved
    if (memberData.slotNumber) {
      const slotReserved = await this.prisma.circleMember.findFirst({
        where: {
          circleId,
          slotNumber: memberData.slotNumber,
        },
      });

      if (slotReserved) {
        throw new ConflictException(`Slot number ${memberData.slotNumber} is already reserved.`);
      }
    }

    // Step 5: Add the user to the circle with appropriate status
    return this.prisma.circleMember.create({
      data: {
        circleId,
        userId: user.id,
        slotNumber: memberData.slotNumber, // on create only the owner should have a slot number
        status: memberData.status || MemberStatus.PENDING,
      },
    });
  }

  async removeMemberFromCircle(circleId: string, memberId: string) {
    // Check if the member exists and belongs to the specified circle
    const existingMember = await this.prisma.circleMember.findUnique({
      where: { id: memberId },
    });

    if (!existingMember || existingMember.circleId !== circleId) {
      throw new BadRequestException('Member not found in this circle.');
    }

    // Remove the member
    await this.prisma.circleMember.delete({ where: { id: memberId } });
  }
}
