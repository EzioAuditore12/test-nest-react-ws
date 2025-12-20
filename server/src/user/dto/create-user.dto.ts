import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ maxLength: 16, example: 'example1' })
  @MaxLength(50)
  username: string;

  @ApiProperty({ maxLength: 16, example: 'example' })
  @MaxLength(50)
  name: string;

  @ApiProperty({ maxLength: 16, example: 'Example@123' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @MaxLength(16)
  password: string;
}
