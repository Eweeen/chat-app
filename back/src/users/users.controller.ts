import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/signup.dto';
import { User } from './entities/user.entity';

@Controller({ version: '1', path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign-up')
  async signUp(@Body() user: SignUpDto): Promise<User> {
    return this.usersService.signUp(user);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
