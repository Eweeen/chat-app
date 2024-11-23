import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client ${client.id} is connected`);
  }

  handleDisconnect(client: any) {
    console.log(`Client ${client.id} is disconnected`);
  }

  // Méthode pour rejoindre une room
  @SubscribeMessage('joinRoom')
  joinRoom(client: any, room: string) {
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  // Méthode pour quitter une room
  @SubscribeMessage('leaveRoom')
  leaveRoom(client: any, room: string) {
    client.leave(room);
    console.log(`Client ${client.id} left room ${room}`);
  }

  // Méthode pour envoyer un événement WebSocket à tous les clients connectés
  @SubscribeMessage('message')
  sendEventToAll(@MessageBody() data: any) {
    const roomId = data.roomId;
    this.server.to(roomId).emit('message', data);
  }
}
