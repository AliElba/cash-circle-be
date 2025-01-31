import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCircleDto, UpdateCircleDto } from './dto/circle.dto';
import { AddMemberDto } from './dto/member.dto';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class CirclesService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService
  ) {}

  /**
   * Create a new circle and optionally add members.
   */
  async createCircle(data: CreateCircleDto) {
    try {
      // Step 1: Create the circle
      const circle = await this.prisma.circle.create({
        data: {
          name: data.name,
          ownerId: data.ownerId,
        },
      });

      // Step 2: Add members if provided
      if (data.members && data.members.length > 0) {
        await this.prisma.circleMember.createMany({
          data: data.members.map((member) => ({
            circleId: circle.id,
            userId: member.userId,
            slotNumber: member.slotNumber,
            status: 'pending', // Default status
          })),
        });
      }

      return circle;
    } catch (error) {
      throw new BadRequestException(`Error creating circle: ${(error as { message: string }).message}`);
    }
  }

  /**
   * Get all circles with members and owners.
   */
  async getAllCircles() {
    return this.prisma.circle.findMany({
      include: {
        members: true,
        owner: true,
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
        members: true,
        owner: true,
      },
    });

    if (!circle) {
      throw new BadRequestException('Circle not found');
    }

    return circle;
  }

  async updateCircle(id: string, data: UpdateCircleDto) {
    // Step 1: Update the circle's main fields
    const updatedCircle = await this.prisma.circle.update({
      where: { id },
      data: {
        name: data.name,
        ownerId: data.ownerId,
        status: data.status,
      },
    });

    // Step 2: Handle member updates
    if (data.members && data.members.length > 0) {
      for (const member of data.members) {
        await this.prisma.circleMember.update({
          where: { id: member.id }, // Use the member's ID to update
          data: {
            status: member.status,
            slotNumber: member.slotNumber,
          },
        });
      }
    }

    return updatedCircle;
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
   * 2. If only email is provided:
   *    • Check if the user exists by their email.
   *    • If not, create a new unregistered user.
   * 3. If neither userId nor email is provided:
   *    • Throw a BadRequestException.
   * 4. Validate slot availability before adding the user to the circle.
   */
  async addMemberToCircle(circleId: string, memberData: AddMemberDto) {
    let user: User | null = null;

    // Step 1: Handle userId if provided
    if (memberData.userId) {
      user = await this.prisma.user.findUnique({ where: { id: memberData.userId } });

      if (!user) {
        throw new BadRequestException('User not found with the provided userId.');
      }
    }

    // Step 2: Handle email if userId is not provided
    if (!user && memberData.email) {
      user = await this.prisma.user.findUnique({ where: { email: memberData.email } });

      if (!user) {
        // Create an unregistered user if no user exists with the provided email
        // user = await this.prisma.user.create({
        //   data: {
        //     email: memberData.email,
        //     status: 'unregistered',
        //   },
        // });
        user = await this.userService.createUnregisteredUser({ email: memberData.email });
      }
    }

    if (!user) {
      throw new BadRequestException('Either userId or email must be provided.');
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
        slotNumber: memberData.slotNumber,
        status: user.status === 'registered' ? 'active' : 'pending',
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
