import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;
}

export class CreateUnregisteredUserDto {
  @ApiProperty()
  phone: string;
}
