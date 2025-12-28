import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class LoginUserDto implements Pick<User, 'username' | 'password'> {
  @ApiProperty({ maxLength: 50, required: true })
  @MaxLength(50)
  username: string;

  @ApiProperty({ maxLength: 16, required: true })
  @MaxLength(16)
  password: string;

  @ApiProperty({
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
    nullable: true,
    required: false,
  })
  @IsOptional()
  expoPushToken?: string;
}
