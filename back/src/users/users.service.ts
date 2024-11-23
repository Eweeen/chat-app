import { Injectable } from '@nestjs/common';
import { DataSource, Equal } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}

  usersRepository() {
    return this.dataSource.getRepository(User);
  }

  async signUp(user: SignUpDto): Promise<User> {
    user.password = await hash(user.password, 10);
    return this.usersRepository().save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository().find();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository().findOneBy({ id });
  }

  async findOneAuthentification(email: string): Promise<User> {
    return await this.usersRepository().findOne({
      select: ['id', 'username', 'email', 'password'],
      where: { email: Equal(email) },
    });
  }
}
