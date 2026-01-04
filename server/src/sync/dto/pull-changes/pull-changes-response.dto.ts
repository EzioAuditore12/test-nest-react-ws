import { Type } from 'class-transformer';
import { SyncConversationsDto } from '../sync-conversations.dto';
import { SyncUsersDto } from '../sync-users.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  SyncDirectChatDto,
  SyncDirectChatsDto,
} from '../sync-direct-chats.dto';

export class ChangesDto {
  @Type(() => SyncConversationsDto)
  @ApiProperty({ type: SyncConversationsDto })
  conversations: SyncConversationsDto;

  @Type(() => SyncUsersDto)
  @ApiProperty({ type: SyncUsersDto })
  users: SyncUsersDto;

  @Type(() => SyncDirectChatDto)
  @ApiProperty({ type: SyncDirectChatsDto })
  direct_chats: SyncDirectChatsDto;
}

export class PullChangesResponseDto {
  @Type(() => ChangesDto)
  @ApiProperty({ type: ChangesDto })
  changes: ChangesDto;

  timestamp: number;
}
