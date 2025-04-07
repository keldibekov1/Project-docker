import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDto, RegisterDto } from './dto/login.dto';
import { Session } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user?.verified) {
      throw new BadRequestException('Siz allaqachon royxatdan otgansiz');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.prisma.user.upsert({
      where: { email },
      update: { otp, verified: false },
      create: { email, otp, verified: false },
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Tasdiqlash kodi',
      text: `Sizning tasdiqlash kodingiz: ${otp}`,
    });

    return { message: 'Tasdiqlash kodi yuborildi', otp }; 
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp) {
      throw new BadRequestException('Notogri OTP');
    }

    await this.prisma.user.update({
      where: { email },
      data: { verified: true, otp: null },
    });

    return { message: 'Email muvaffaqiyatli tasdiqlandi' };
  }

  async register(data: RegisterDto) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });

    if (!user || !user.verified) {
      throw new BadRequestException('Foydalanuvchi topilmadi yoki OTP tasdiqlanmagan');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await this.prisma.user.update({
      where: { email: data.email },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        password: hashedPassword,
        img: data.img || null,
      },
    });

    return { message: 'Royxatdan otish muvaffaqiyatli yakunlandi!' };
  }

  async login(data: LoginDto, req: Request) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Email yoki parol notogri');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // session yaratish
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ip = req.ip || 'unknown';

    await this.prisma.session.create({
      data: {
        userId: user.id,
        userAgent,
        ip ,
      },
    });

    return { token };
  }

  async logout(userId: string, req: Request) {
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip;

    await this.prisma.session.deleteMany({
      where: {
        userId,
        userAgent,
        ip,
      },
    });

    return { message: 'Tizimdan chiqildi' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        img: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return user;
  }

  async getSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
