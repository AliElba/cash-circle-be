import { IsEmail, IsIn, IsOptional, IsString, ValidateIf } from 'class-validator';

export class MemberDto {
  @IsString()
  userId: string;

  @IsOptional()
  slotNumber?: number;
}

export class MemberUpdateDto {
  @IsString()
  id: string; // ID of the existing member

  @IsOptional()
  @IsIn(['pending', 'confirmed'])
  status?: string; // Update member status

  @IsOptional()
  slotNumber?: number; // Update member slot
}

export class AddMemberDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @ValidateIf((o: AddMemberDto) => !o.userId) // email is required if userId is not provided
  @IsEmail()
  email: string;

  @IsOptional()
  slotNumber?: number;
}
