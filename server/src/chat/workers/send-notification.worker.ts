import { WorkerHost, Processor } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bullmq';
import Expo from 'expo-server-sdk';

import { PushNotificationDto } from 'src/common/dto/push-notification.dto';

export const SEND_NOTIFICATION_QUEUE_NAME = 'send-notification';

@Processor(SEND_NOTIFICATION_QUEUE_NAME)
export class SendNotificationQueue extends WorkerHost {
  constructor(private readonly expo: Expo) {
    super();
  }

  async process(job: Job<PushNotificationDto>): Promise<void> {
    const { expoPushToken, body, title, metadata } = job.data;

    if (!Expo.isExpoPushToken(expoPushToken))
      throw new BadRequestException('Given token is invalid');

    await this.expo.sendPushNotificationsAsync([
      {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: metadata,
      },
    ]);
  }
}
