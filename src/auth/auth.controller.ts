import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Use the local strategy for authentication,
   * but take care this could cause:
   * LocalAuthGuard and JwtAuthGuard are intercepting the request before the validation process happens,
   * which prevents the validation from running.
   */
  @HttpCode(HttpStatus.OK)
  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    // LocalAuthGuard is removed; manually validate user in the service to validate the user using class-validator setup on dto
    const user = await this.authService.validateUser(loginDto);

    return this.authService.login(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto): Promise<Partial<User>> {
    return this.authService.register(registerDto);
  }
}
