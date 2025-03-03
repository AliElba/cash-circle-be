import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUnregisteredUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        circlesOwned: true,
        circleMemberships: true,
      },
    });
  }

  async editUser(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: { ...dto },
    });

    delete (user as Partial<User>).password; // Remove the password from the user object before returning it to the client
    return user;
  }

  async createUnregisteredUser(dto: CreateUnregisteredUserDto) {
    // Check if the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (existingUser) {
      if (existingUser.status === UserStatus.REGISTERED) {
        throw new ConflictException('This phone is already associated with a registered user.');
      }
      return existingUser; // Return the existing unregistered user
    }

    // Create a new unregistered user
    return this.prisma.user.create({
      data: {
        phone: dto.phone,
        name: dto.name,
        status: UserStatus.UNREGISTERED,
      },
    });
  }
}
