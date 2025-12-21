import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // TODO: Will replace it with jwt auth for sender id
  @Post()
  @ApiOperation({ summary: 'Start a chat' })
  @ApiBody({ type: CreateChatDto })
  async create(@Body() createChatDto: CreateChatDto) {
    return await this.chatService.create(createChatDto);
  }
}
