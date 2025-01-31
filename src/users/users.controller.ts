import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GetUser } from '../auth/user.decorator';
import { CreateUnregisteredUserDto, UpdateUserDto } from './dto/user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  /**
   * Get the current authenticated user, getting the user ID from the JWT payload (token)
   * sample request:  GET /users/me
   * @param user
   */
  @Get('me')
  getMe(@GetUser() user: User): User {
    return user;
  }

  /**
   * Edit the current authenticated user, getting the user ID from the JWT payload (token)
   * sample request:  PATCH /users
   * with body: { "email": "New Name", firstName: "New First Name", lastName: "New Last Name" }
   * @param userId
   * @param dto
   */
  @Patch()
  editUser(@GetUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Post('unregistered')
  createUnregisteredUser(@Body() dto: CreateUnregisteredUserDto) {
    return this.userService.createUnregisteredUser(dto);
  }
}
