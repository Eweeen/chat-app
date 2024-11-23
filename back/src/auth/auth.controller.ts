import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import AuthDto from './dto/auth.dto';
import { AuthService } from './auth.service';
import TokenModel from './token.model';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() authDto: AuthDto, @Res() res: Response) {
    const response = await this.authService.login(authDto);
    if (response instanceof TokenModel) {
      res.cookie('refreshToken', response.getRefreshToken(), {
        expires: new Date(
          new Date().getTime() +
            parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE) * 60 * 60 * 1000,
        ),
        sameSite: 'strict',
        httpOnly: true,
        secure: true,
      });
      return res.send({ token: response.getToken() });
    }
    throw new HttpException(response, HttpStatus.UNAUTHORIZED);
  }

  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    if (req.headers.cookie) {
      const response = await this.authService.refresh(req.headers.cookie);
      if (response instanceof TokenModel) {
        res.cookie('refreshToken', response.getRefreshToken(), {
          expires: new Date(
            new Date().getTime() +
              parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE) * 60 * 60 * 1000,
          ),
          sameSite: 'strict',
          httpOnly: true,
        });
        return res.status(200).send({ token: response.getToken() });
      } else {
        throw new HttpException(response, response.statusCode);
      }
    } else {
      throw new HttpException(
        `La requête a été envoyé sans cookies`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/logout')
  logout(@Res() res: Response): Response {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return res.send({ message: 'Logout successfully' });
  }
}
