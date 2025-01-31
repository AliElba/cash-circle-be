import { ArrayMinSize, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberDto, MemberUpdateDto } from './member.dto';

export class CreateCircleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  ownerId: string;

  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  @ArrayMinSize(1) // Ensure at least one member is invited
  @IsOptional()
  members?: MemberDto[];
}

export class UpdateCircleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  ownerId?: string;

  @IsString()
  @IsOptional()
  @IsIn(['pending', 'active', 'completed'])
  status?: string;

  @ValidateNested({ each: true })
  @Type(() => MemberUpdateDto)
  @IsOptional()
  members?: MemberUpdateDto[]; // Array of members to update
}
