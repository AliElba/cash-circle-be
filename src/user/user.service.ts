import { Injectable } from '@nestjs/common';
import { EditUserDto } from './edit-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete (user as Partial<User>).password; // Remove the password from the user object before returning it to the client
    return user;
  }
}
