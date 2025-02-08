import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon from 'argon2';
import { LoginDto } from './dto/login.dto';
import { User, UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const { phone, password, name } = dto;
    const hashedPassword = await argon.hash(password);

    // Check if the user already exists
    const existingUser = await this.prismaService.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      if (existingUser.status === UserStatus.REGISTERED) {
        throw new HttpException('User already exists with this phone', HttpStatus.CONFLICT);
      }

      // Update the unregistered user's status, password, and optional fields
      return this.prismaService.user.update({
        where: { phone },
        data: {
          status: UserStatus.REGISTERED,
          password: hashedPassword,
          name: name || existingUser.name,
        },
        select: { id: true, phone: true, status: true },
      });
    }

    // If the user doesn't exist, create a new registered user
    return this.prismaService.user.create({
      data: {
        phone,
        password: hashedPassword,
        status: UserStatus.REGISTERED,
        name,
      },
      select: { id: true, phone: true, status: true, name: true },
    });
  }

  async login(user: User): Promise<{ access_token: string }> {
    console.log('AuthService:login ', user);
    const payload = { username: user.phone, sub: user.id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  /**
   * Validates the user credentials during login.
   * This method is used in the LocalStrategy to ensure that the provided
   * phone and password match an existing user in the database.
   * It is called by the validate method in the LocalStrategy.
   */
  async validateUser(dto: LoginDto): Promise<User> {
    console.log('AuthService:validateUser ', dto);
    const { phone, password: _password } = dto;
    const user = await this.prismaService.user.findUnique({ where: { phone } });
    if (!user || !user.password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const passwordMatches = await argon.verify(user.password, _password);
    if (!passwordMatches) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    delete (user as Partial<User>).password; // Remove the password from the user object before returning it to the client
    return user;
  }
}
