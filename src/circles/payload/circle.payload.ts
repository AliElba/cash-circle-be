import { CircleMemberPayload } from './circle-member.payload';
import { ApiProperty } from '@nestjs/swagger';
import { CircleMember, CircleStatus, User } from '@prisma/client';
import { UserPayload } from '../../users/payload/user-payload';

export class CirclePayload {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty({ enum: CircleStatus, example: CircleStatus.PENDING + ' test' })
  status: CircleStatus;

  @ApiProperty({ example: 10, description: 'Duration of the circle in Months' })
  duration: number;

  @ApiProperty({ example: 1000, description: 'Total amount for the circle' })
  amount: number;

  @ApiProperty({ example: '2024-03-01T00:00:00.000Z', description: 'Start date of the circle' })
  startDate: Date;

  @ApiProperty({ example: '2024-12-01T00:00:00.000Z', description: 'End date of the circle' })
  endDate?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Relationships
  // **************

  @ApiProperty({ description: 'Owner user of the circle (relation)', type: UserPayload })
  owner: User; // using prisma generated client model to avoid circular dependency

  @ApiProperty({ description: 'Members of the circle (relation)', type: [CircleMemberPayload] })
  members: CircleMember[]; // using prisma generated client model to avoid circular dependency
}
