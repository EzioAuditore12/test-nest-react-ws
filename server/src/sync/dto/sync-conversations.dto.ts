import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { IsObjectId } from 'src/common/validators/is-object-id';

export class SyncConversationDto {
  @IsObjectId()
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Must be valid mongo id',
  })
  id: string;

  @IsString()
  @MaxLength(50)
  @ApiProperty({ example: 'example', maxLength: 50 })
  contact: string;

  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-XXX4-426614174000' })
  user_id: string;

  @IsInt()
  created_at: number;

  @IsInt()
  updated_at: number;
}

export class SyncConversationsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncConversationDto)
  @ApiProperty({
    type: [SyncConversationDto],
    description: 'Array of created conversations',
  })
  created: SyncConversationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncConversationDto)
  @ApiProperty({
    type: [SyncConversationDto],
    description: 'Array of updated conversations',
  })
  updated: SyncConversationDto[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    description: 'Array of deleted conversation ids',
  })
  deleted: string[];
}
