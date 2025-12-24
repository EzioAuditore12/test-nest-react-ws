import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { ConfigType } from '@nestjs/config';

import jwtConfig from '../configs/jwt.config';
import { AuthJwtPayload } from '../types/auth-jwt.payload';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest: (handshake: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return handshake.auth.token;
      },
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    return { id: payload.sub };
  }
}
