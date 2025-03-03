import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { MemberStatus, PaymentStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class MemberDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID of the existing member' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID if the member already exists' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: '004123456789', description: 'Phone number of the member' })
  @ValidateIf((o: MemberDto) => !o.userId)
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'John Due', description: 'User name of the member' })
  @ValidateIf((o: MemberDto) => !o.userId)
  @IsString()
  userName?: string;

  @ApiProperty({ example: 2, description: 'Slot number for the member in the circle' })
  @IsOptional()
  @IsNumber()
  slotNumber?: number;

  @ApiProperty({ enum: MemberStatus, example: MemberStatus.PENDING, description: 'Status of the member' })
  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;

  @ApiProperty({ enum: PaymentStatus, example: 'PENDING', description: 'Payment status of the member' })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiProperty({ example: '2024-06-15T00:00:00.000Z', description: 'Payout date for this member' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  payoutDate?: Date;

  @ApiProperty({ example: 5.0, description: 'Administrative fees paid by this member' })
  @IsOptional()
  @IsNumber()
  adminFees?: number;
}
