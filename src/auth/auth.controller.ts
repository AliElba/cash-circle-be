import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { GetUser } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard) // Use the local strategy for authentication
  @Post('login')
  login(@GetUser() user: User): Promise<{ access_token: string }> {
    console.log('AuthController:login ', user);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard) // Use the jwt strategy for authentication to protect this route from unauthorized access
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<Partial<User>> {
    return this.authService.register(registerDto);
  }
}
