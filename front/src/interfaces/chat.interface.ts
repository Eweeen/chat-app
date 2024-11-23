import { User } from "./user.interface";

export interface Chat {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  sender: User;
  receiver: User;
}