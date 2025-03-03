import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GetUser } from '../auth/user.decorator';
import { CreateUnregisteredUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UserPayload } from './payload/user-payload';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  /**
   * Get all users
   * sample request:  GET /users
   */
  @Get()
  @ApiResponse({ description: 'Get all Users', type: [UserPayload] })
  getUsers() {
    return this.userService.getAllUsers();
  }

  /**
   * Get the current authenticated user, getting the user ID from the JWT payload (token)
   * sample request:  GET /users/me
   * @param user
   */
  @Get('me')
  @ApiResponse({ description: 'Get current user, knowing the id from the token', type: UserPayload })
  getMe(@GetUser() user: User): User {
    return user;
  }

  /**
   * Edit the current authenticated user, getting the user ID from the JWT payload (token)
   * Sample Request:  PATCH /users
   * with body: { "phone": "new phone number", name: "New Name" }
   * @param userId
   * @param dto
   */
  @Patch()
  @ApiResponse({ description: 'Edit current user', type: UserPayload })
  editUser(@GetUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Post('unregistered')
  @ApiResponse({ description: 'Create an unregistered user', type: UserPayload })
  createUnregisteredUser(@Body() dto: CreateUnregisteredUserDto) {
    return this.userService.createUnregisteredUser(dto);
  }
}
