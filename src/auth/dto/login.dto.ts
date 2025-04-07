import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty, IsUUID } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Foydalanuvchi email manzili' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Ali', description: 'Foydalanuvchi ismi' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'Valiyev', description: 'Foydalanuvchi familiyasi' })
  @IsString()
  @IsNotEmpty()
  lastname: string;


  @ApiProperty({ example: '12345678', description: 'Parol kamida 6 ta belgi bolishi kerak' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Profil rasmi URL manzili' })
  @IsString()
  @IsNotEmpty()
  img: string;
}


export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Foydalanuvchi email manzili' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345678', description: 'Foydalanuvchi paroli' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 'user@example.com', description: 'Foydalanuvchi email manzili' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '654321', description: 'Foydalanuvchiga yuborilgan OTP kodi' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}