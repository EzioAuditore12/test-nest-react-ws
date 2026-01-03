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

export class SyncUserDto {
  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-XXX4-426614174000' })
  id: string;

  @IsString()
  @MaxLength(50)
  @ApiProperty({ example: 'example' })
  username: string;

  @IsString()
  @MaxLength(50)
  @ApiProperty({ example: 'Example' })
  name: string;

  @IsInt()
  @ApiProperty({ type: 'number', example: 1704192000 })
  created_at: number;

  @IsInt()
  @ApiProperty({ type: 'number', example: 1704192000 })
  updated_at: number;
}

export class SyncUsersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncUserDto)
  @ApiProperty({
    type: [SyncUserDto],
    description: 'Array of created users',
  })
  created: SyncUserDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncUserDto)
  @ApiProperty({
    type: [SyncUserDto],
    description: 'Array of updated users',
  })
  updated: SyncUserDto[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    description: 'Array of deleted users ids',
  })
  deleted: string[];
}
