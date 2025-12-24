import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';

export class WsJwtGuard extends AuthGuard('ws-jwt') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient<Socket>().handshake;
  }
}
