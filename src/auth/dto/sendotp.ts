import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'Foydalanuvchi email manzili' 
  })
  @IsEmail()
  email: string;
}