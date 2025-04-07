import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
    });
  }

  async findAll(query) {
    const { search, sortBy, sortOrder, page, limit } = query;
    const skip = (page - 1) * limit;

    return this.prisma.product.findMany({
      where: { name: { contains: search || '' } },
      orderBy: { [sortBy || 'name']: sortOrder || 'asc' },
      skip: +skip,
      take: +limit,
      include: {
        category: {
          select: {
            name: true,  
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
