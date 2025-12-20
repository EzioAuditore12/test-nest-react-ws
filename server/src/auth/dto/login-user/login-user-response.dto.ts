import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TokensDto } from '../tokens.dto';

import { User } from 'src/user/entities/user.entity';

export class LoginUserResponseDto {
  @ApiProperty({ type: () => OmitType(User, ['password']) })
  user: Omit<User, 'password'>;

  tokens: TokensDto;
}
