import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { SyncService } from './sync.service';
import { PullChangesDto } from './dto/pull-changes/pull-changes.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthRequest } from 'src/auth/types/auth-jwt.payload';
import { PullChangesResponseDto } from './dto/pull-changes/pull-changes-response.dto';

@Controller('sync')
@ApiTags('Sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @UseGuards(JwtAuthGuard)
  @Get('pull')
  @ApiResponse({ type: PullChangesResponseDto })
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
}
