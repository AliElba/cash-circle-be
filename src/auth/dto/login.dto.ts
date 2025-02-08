// src/auth/dto/login.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  //@IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}
