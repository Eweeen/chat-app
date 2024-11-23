import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ name: 'username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ name: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ name: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
