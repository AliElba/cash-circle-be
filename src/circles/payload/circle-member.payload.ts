import { CirclePayload } from './circle.payload';
import { ApiProperty } from '@nestjs/swagger';
import { UserPayload } from '../../users/payload/user-payload';
import { Circle, CircleStatus, MemberStatus, PaymentStatus, User } from '@prisma/client';

export class CircleMemberPayload {
  @ApiProperty()
  id: string;

  @ApiProperty()
  circleId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  slotNumber: number;

  @ApiProperty({ example: '2024-06-15T00:00:00.000Z', description: 'Payout date for this member' })
  payoutDate?: Date;

  @ApiProperty({ example: 5.0, description: 'Administrative fees paid by this member' })
  adminFees?: number;

  @ApiProperty({ enum: CircleStatus, example: CircleStatus.PENDING + ' test' })
  status: MemberStatus;

  @ApiProperty({ enum: PaymentStatus, example: 'PENDING', description: 'Payment status of the member' })
  paymentStatus: PaymentStatus;

  @ApiProperty({ type: UserPayload })
  user: User; // using prisma generated client model to avoid circular dependency

  @ApiProperty({ type: CirclePayload })
  circle: Circle; // using prisma generated client model to avoid circular dependency

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
