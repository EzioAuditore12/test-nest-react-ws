import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { SyncService } from './sync.service';
import { PullChangesDto } from './dto/pull-changes/pull-changes.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthRequest } from 'src/auth/types/auth-jwt.payload';
import { PushChangesDto } from './dto/push-changes/push-changes.dto';

@Controller('sync')
@ApiTags('Sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @UseGuards(JwtAuthGuard)
  @Get('pull')
  async pullChanges(
    @Req() req: AuthRequest,
    @Query() pullChangesDto: PullChangesDto,
    @Res() reply: FastifyReply,
  ) {
    const userId = req.user.id;

    const changes = await this.syncService.pullChanges(
      userId,
      pullChangesDto.lastPulledAt,
    );

    return reply.status(HttpStatus.OK).send(changes);
  }

  @Post('push')
  @ApiBody({ type: PushChangesDto })
  async pushChanges(
    @Req() req: AuthRequest,
    @Body() pushChangesDto: PushChangesDto,
    @Res() reply: FastifyReply,
  ) {
    const userId = req.user.id;

    await this.syncService.pushChanges(userId, pushChangesDto);

    return reply.status(HttpStatus.CREATED).send({
      status: 'success',
      message: 'Sync done successfully',
    });
  }
}
