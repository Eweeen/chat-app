import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(private dataSource: DataSource) {}

  chatRepository() {
    return this.dataSource.getRepository(Chat);
  }

  async create(chat: CreateChatDto): Promise<Chat> {
    return await this.chatRepository().save({
      content: chat.content,
      sender: { id: chat.sender_id },
      receiver: { id: chat.receiver_id },
    });
  }

  async findByUserId(userId: number): Promise<Chat[]> {
    const chat = await this.chatRepository().find({
      relations: { sender: true, receiver: true },
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      order: { createdAt: 'DESC' },
      withDeleted: true,
    });

    const ids = [
      ...new Set([
        ...chat.map((u) => u.receiver.id),
        ...chat.map((u) => u.sender.id),
      ]),
    ];

    const idsConv = ids.filter((id) => +id !== +userId);

    return idsConv.map((id) => {
      const messages = chat.filter(
        (c) => c.sender.id === id || c.receiver.id === id,
      );
      const lastMessage = messages[0];
      return lastMessage;
    });
  }

  async findMessagesByUsers(
    senderId: number,
    receiverId: number,
  ): Promise<Chat[]> {
    return await this.chatRepository().find({
      relations: { sender: true, receiver: true },
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
      withDeleted: true,
      order: { createdAt: 'ASC' },
    });
  }
}
