import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { SocketGateway } from 'src/websocket/socket.gateway';

@Controller({ version: '1', path: 'chat' })
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly webSocketGateway: SocketGateway,
  ) {}

  @Post()
  async create(@Body() chat: CreateChatDto): Promise<Chat> {
    const newMessage = await this.chatService.create(chat);
    this.webSocketGateway.sendEventToAll({
      ...newMessage,
      roomId: `${chat.receiver_id}-${chat.sender_id}`,
    });
    return newMessage;
  }

  @Get('conversations/:userId')
  async findByUserId(@Param('userId') userId: number): Promise<Chat[]> {
    return await this.chatService.findByUserId(userId);
  }

  @Get('messages/:senderId/:receiverId')
  async findMessagesByUsers(
    @Param('senderId') senderId: number,
    @Param('receiverId') receiverId: number,
  ): Promise<Chat[]> {
    return await this.chatService.findMessagesByUsers(senderId, receiverId);
  }
}
