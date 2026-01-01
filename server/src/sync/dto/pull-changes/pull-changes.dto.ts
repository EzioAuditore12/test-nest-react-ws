import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PullChangesDto {
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 0))
  @ApiProperty({ type: 'number' })
  lastPulledAt: number;
}
