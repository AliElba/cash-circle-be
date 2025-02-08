import { ArrayMinSize, IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberDto, MemberUpdateDto } from './member.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CircleStatus } from '@prisma/client';

export class CreateCircleDto {
  @ApiProperty({ example: 'Investment Club' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  ownerId: string;

  @ApiProperty({ example: 10, description: 'Duration of the circle in Months' })
  @IsInt()
  @Min(1) // Ensure duration is at least 1 Month
  duration: number;

  @ApiProperty({ example: 1000, description: 'Total amount for the circle' })
  @IsInt()
  @Min(1000)
  amount: number;

  @ApiProperty({ example: '2024-03-01T00:00:00.000Z', description: 'Start date of the circle' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: '2024-12-01T00:00:00.000Z', description: 'End date of the circle' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ enum: CircleStatus, example: CircleStatus.PENDING + ' test' })
  @IsEnum(CircleStatus)
  @IsOptional()
  status?: CircleStatus;

  @ApiProperty({ type: [MemberDto], description: 'Array of members in the circle' })
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  @ArrayMinSize(1) // Ensure at least one member is invited
  @IsOptional()
  members?: MemberDto[];
}

export class UpdateCircleDto {
  @ApiProperty({ example: 'Savings Group' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  ownerId?: string;

  @ApiProperty({ example: 10, description: 'Duration of the circle in Months' })
  @IsInt()
  @Min(1) // Ensure duration is at least 1 Month
  duration: number;

  @ApiProperty({ example: '2024-03-01T00:00:00.000Z', description: 'Start date of the circle' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ example: '2024-12-01T00:00:00.000Z', description: 'End date of the circle' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ enum: CircleStatus, example: CircleStatus.ACTIVE })
  @IsEnum(CircleStatus)
  @IsOptional()
  status?: CircleStatus;

  @ApiProperty({ type: [MemberUpdateDto], description: 'Array of members to update' })
  @ValidateNested({ each: true })
  @Type(() => MemberUpdateDto)
  @IsOptional()
  members?: MemberUpdateDto[];
}
