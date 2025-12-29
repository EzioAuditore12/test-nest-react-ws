import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

import { IsObjectId } from 'src/common/validators/is-object-id';

export class InsertChatDto {
  @IsObjectId()
  conversationId: string;

  @IsUUID()
  receiverId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text: string;
}
