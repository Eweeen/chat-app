import {
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import jwt from 'jsonwebtoken';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from './auth.guard';

export const JwtUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return 0;
    }
    try {
      const token: string = request.headers.authorization.split(' ')[1];
      const decodedToken = jwt.decode(token);
      const user: User = new User();
      user.id = decodedToken['id'];
      user.username = decodedToken['username'];
      user.email = decodedToken['email'];
      return user;
    } catch (e) {
      console.log(e);
      return 0;
    }
  },
);

export function Auth() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
