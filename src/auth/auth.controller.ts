import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { GetUser } from './user.decorator';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    console.log('AuthController:login ', loginDto);

    console.log('LocalStrategy:validate: ', loginDto);
    // LocalAuthGuard is removed; manually validate user in the service to validate the user using class-validator setup on dto
    const user = await this.authService.validateUser(loginDto);

    return this.authService.login(user);
  }

  @HttpCode(HttpStatus.OK)
  /**
   * Use the local strategy for authentication,
   * but take care this could cause:
   * LocalAuthGuard and JwtAuthGuard are intercepting the request before the validation process happens,
   * which prevents the validation from running.
   */
  @UseGuards(LocalAuthGuard)
  @Post('_login')
  _login(@GetUser() user: User): Promise<{ access_token: string }> {
    console.log('AuthController:login ', user);
    return this.authService.login(user);
  }

  //@UseGuards(JwtAuthGuard) // Use the jwt strategy for authentication to protect this route from unauthorized access
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<Partial<User>> {
    return this.authService.register(registerDto);
  }
}
