import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MemberStatus, PaymentStatus } from '@prisma/client';

export class MemberDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 2, description: 'Slot number for the member in the circle' })
  @IsOptional()
  @IsNumber()
  slotNumber?: number;

  @ApiProperty({ enum: MemberStatus, example: MemberStatus.PENDING, description: 'Status of the member' })
  @IsEnum(MemberStatus)
  status: MemberStatus;

  @ApiProperty({ enum: PaymentStatus, example: 'PENDING', description: 'Payment status of the member' })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty({ example: '2024-06-15T00:00:00.000Z', description: 'Payout date for this member' })
  @IsOptional()
  @IsDate()
  payoutDate?: Date;

  @ApiProperty({ example: 5.0, description: 'Administrative fees paid by this member' })
  @IsOptional()
  @IsNumber()
  adminFees?: number;

  @ApiProperty({ example: '2024-01-31T10:00:00.000Z', description: 'Last update timestamp' })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}

export class MemberUpdateDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID of the existing member' })
  @IsString()
  id: string;

  @ApiProperty({ enum: MemberStatus, example: MemberStatus.CONFIRMED, description: 'Updated status of the member' })
  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;

  @ApiProperty({ example: 2, description: 'Update member slot number' })
  @IsOptional()
  @IsNumber()
  slotNumber?: number;

  @ApiProperty({ example: '2024-06-15T00:00:00.000Z', description: 'Updated payout date' })
  @IsOptional()
  @IsDate()
  payoutDate?: Date;

  @ApiProperty({ example: 5.0, description: 'Updated administrative fees' })
  @IsOptional()
  @IsNumber()
  adminFees?: number;
}

export class AddMemberDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID if the member already exists' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: '004123456789', description: 'Phone number of the member' })
  @ValidateIf((o: AddMemberDto) => !o.userId)
  //@IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 2, description: 'Slot number for the member' })
  @IsOptional()
  @IsNumber()
  slotNumber?: number;

  @ApiProperty({ example: '2024-06-15T00:00:00.000Z', description: 'Payout date for this member' })
  @IsOptional()
  @IsDate()
  payoutDate?: Date;

  @ApiProperty({ example: 5.0, description: 'Administrative fees paid by this member' })
  @IsOptional()
  @IsNumber()
  adminFees?: number;
}
