import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { PushNotificationDto } from './common/dto/push-notification.dto';
import { ApiBody } from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  @ApiBody({ type: PushNotificationDto })
  async pushNotification(
    @Body() pushNotificationDto: PushNotificationDto,
    @Res() reply: FastifyReply,
  ) {
    const tickets = await this.appService.pushNotification(pushNotificationDto);

    return reply.status(HttpStatus.OK).send(tickets);
  }
}
