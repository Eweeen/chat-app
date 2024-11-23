import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import AuthDto from './dto/auth.dto';
import { User } from 'src/users/entities/user.entity';
import { compare } from 'bcryptjs';
import { decode, sign } from 'jsonwebtoken';
import TokenModel from './token.model';
import { readFileSync } from 'fs';

@Injectable()
export class AuthService {
  public constructor(private readonly userService: UsersService) {}

  public async login(authDto: AuthDto) {
    const user: User = await this.userService.findOneAuthentification(
      authDto.email,
    );

    // If user not found or password not match
    if (!user || !(await compare(authDto.password, user.password))) {
      return {
        message: 'Identifiants incorrect',
      };
    }

    return this.generateTokens(user);
  }

  public async refresh(
    cookies: string,
  ): Promise<TokenModel | { statusCode: number; message: string }> {
    try {
      const cookiesArray = cookies.split('; ');
      // If accessToken exist
      const matchCookie = cookiesArray.find((cookie) =>
        cookie.includes('refreshToken'),
      );

      const refreshToken = matchCookie.replace('refreshToken=', '').trim();

      const token: any = decode(refreshToken);
      const user: User = await this.userService.findOneAuthentification(
        token.email,
      );
      return this.generateTokens(user);
    } catch (e) {
      return {
        statusCode: 404,
        message: 'RefreshToken introuvable !',
      };
    }
  }

  private async generateTokens(user: User): Promise<TokenModel> {
    const privateKey = readFileSync('./jwt/id_rsa', 'utf8');

    const userToken = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return new TokenModel(
      sign(userToken, privateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE + 's',
      }),
      sign(userToken, privateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE + 'h',
      }),
    );
  }
}
