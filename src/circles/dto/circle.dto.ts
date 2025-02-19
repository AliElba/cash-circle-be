import { IsDate, IsEnum, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberDto } from './member.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CircleStatus } from '@prisma/client';

export class CreateCircleDto {
  @ApiProperty({ example: 'Investment Club' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'cm6wi27kk0001r6aujgx979cx' })
  @IsString()
  ownerId: string;

  @ApiProperty({ example: 10, description: 'Duration of the circle in Months' })
  @IsInt()
  @Min(6) // Ensure duration is at least 6 Month
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

  @ApiProperty({ enum: CircleStatus, example: CircleStatus.PENDING })
  @IsEnum(CircleStatus)
  @IsOptional()
  status?: CircleStatus;

  @ApiProperty({ type: [MemberDto], description: 'Array of members in the circle' })
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  @IsOptional()
  members?: MemberDto[];
}

export class UpdateCircleDto {
  @ApiProperty({ example: 'Savings Group' })
  @IsString()
  name?: string;

  @ApiProperty({ example: 10, description: 'Duration of the circle in Months' })
  @IsInt()
  @Min(6) // Ensure duration is at least 6 Month
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
  endDate: Date;

  @ApiProperty({ type: [MemberDto], description: 'Array of members to update' })
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  @IsOptional()
  members?: MemberDto[];
}
