import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { IsObjectId } from 'src/common/validators/is-object-id';

export class SyncDirectChatDto {
  @IsObjectId()
  @ApiProperty({ example: '60d21b4667d0d8992e610c85' })
  id: string;

  @IsObjectId()
  @ApiProperty({ example: '60d21b4667d0d8992e610c86' })
  conversation_id: string;

  @IsString()
  @MaxLength(1000)
  @ApiProperty({ type: 'string', maxLength: 1000 })
  text: string;

  @IsEnum(['SENT', 'RECEIVED'])
  @ApiProperty({ type: 'string', enum: ['SENT', 'RECEIVED'] })
  mode: 'SENT' | 'RECEIVED';

  @IsBoolean()
  @ApiProperty({ type: 'boolean' })
  is_delivered: boolean;

  @IsBoolean()
  @ApiProperty({ type: 'boolean' })
  is_seen: boolean;

  @IsInt()
  @ApiProperty({ type: 'number', example: 1704192000 })
  created_at: number;

  @IsInt()
  @ApiProperty({ type: 'number', example: 1704192000 })
  updated_at: number;
}

export class SyncDirectChatsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncDirectChatDto)
  @ApiProperty({
    type: [SyncDirectChatDto],
    description: 'Array of created direct',
  })
  created: SyncDirectChatDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncDirectChatDto)
  @ApiProperty({
    type: [SyncDirectChatDto],
    description: 'Array of created direct chats',
  })
  updated: SyncDirectChatDto[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    description: 'Array of deleted direct chats ids',
  })
  deleted: string[];
}
