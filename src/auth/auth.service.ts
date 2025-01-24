import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon from 'argon2';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const { email, password } = dto;
    const hashedPassword = await argon.hash(password);
    const userData = { email, password: hashedPassword };

    const existingUser = await this.prismaService.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new HttpException('User already exists with this email', HttpStatus.CONFLICT);
    }

    return this.prismaService.user.create({ data: userData, select: { id: true, email: true } });
  }

  async login(user: User): Promise<{ access_token: string }> {
    console.log('AuthService:login ', user);
    const payload = { username: user.email, sub: user.id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  /**
   * Validates the user credentials during login.
   * This method is used in the LocalStrategy to ensure that the provided
   * email and password match an existing user in the database.
   * It is called by the validate method in the LocalStrategy.
   */
  async validateUser(dto: LoginDto): Promise<User> {
    console.log('AuthService:validateUser ', dto);
    const { email, password: _password } = dto;
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
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
