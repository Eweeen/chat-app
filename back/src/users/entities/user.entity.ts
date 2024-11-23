import { Chat } from 'src/chat/entities/chat.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'int' })
  id: number;

  @Column({ name: 'username', type: 'varchar' })
  username: string;

  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', select: false })
  password: string;

  // Relations
  @OneToMany(() => Chat, (chat) => chat.sender)
  send_chat: Chat[];

  @OneToMany(() => Chat, (chat) => chat.receiver)
  receive_chat: Chat[];
}
