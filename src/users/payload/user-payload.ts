import { CirclePayload } from '../../circles/payload/circle.payload';
import { CircleMemberPayload } from '../../circles/payload/circle-member.payload';
import { ApiProperty } from '@nestjs/swagger';
import { Circle, CircleMember } from '@prisma/client';

/**
 * This class is created to define the structure of the user payload specifically for Swagger documentation and frontend.
 * It allows us to customize the response type and include additional metadata for API documentation purposes.
 * Using this class instead of the generated User model from Prisma helps in providing a clear and detailed API response schema.
 * will be used by the frontend generator to create a model there too
 *
 * should not have the password
 */
export class UserPayload {
  @ApiProperty({ description: 'Unique identifier for the user' })
  id: string;

  @ApiProperty({ description: 'Phone number of the user' })
  phone: string;

  @ApiProperty({ description: 'Name of the user' })
  name: string;

  @ApiProperty({ description: 'Status of the user' })
  status: string;

  @ApiProperty({ description: "URL or path to the user's avatar" })
  avatar: string;

  @ApiProperty({ description: 'Circles owned by the user', type: CirclePayload })
  circlesOwned: Circle; // using prisma generated client model

  @ApiProperty({ description: 'Circle memberships of the user', type: [CircleMemberPayload] })
  circleMemberships: CircleMember; // using prisma generated client model

  @ApiProperty({ description: 'Date when the user was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the user was last updated' })
  updatedAt: Date;
}
