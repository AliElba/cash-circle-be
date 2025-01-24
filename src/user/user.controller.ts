import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GetUser } from '../auth/user.decorator';
import { EditUserDto } from './edit-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

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
  editUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
