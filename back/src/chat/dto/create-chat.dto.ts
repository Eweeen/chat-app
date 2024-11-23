import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ name: 'content' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ name: 'sender_id' })
  @IsNotEmpty()
  @IsNumber()
  sender_id: number;

  @ApiProperty({ name: 'receiver_id' })
  @IsNotEmpty()
  @IsNumber()
  receiver_id: number;
}
