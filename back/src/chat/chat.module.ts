import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SocketGateway } from 'src/websocket/socket.gateway';

@Module({
  imports: [],
  providers: [ChatService, SocketGateway],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
