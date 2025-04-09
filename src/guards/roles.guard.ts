import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException('Token mavjud emas!');
    }

    const token = authHeader.split(' ')[1];
    const decoded = this.jwtService.decode(token) as { role: string };

    if (!decoded) {
      throw new ForbiddenException('Token dekodlashda xatolik!');
    }

    const handler = context.getHandler();
    const isUpdateRoute = handler.name === 'update'; 

    if (isUpdateRoute && decoded.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Bu amal faqat super adminlar uchun ruxsat etilgan!');
    }

    if (!isUpdateRoute && decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Bu amal faqat adminlar va super adminlar uchun ruxsat etilgan!');
    }

    return true;
  }
}
