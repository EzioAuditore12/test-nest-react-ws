import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthRequest } from 'src/auth/types/auth-jwt.payload';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Start a chat' })
  @ApiBody({ type: CreateChatDto })
  async create(@Req() req: AuthRequest, @Body() createChatDto: CreateChatDto) {
    Logger.log(createChatDto);

    return await this.chatService.create(req.user.id, createChatDto);
  }
}
