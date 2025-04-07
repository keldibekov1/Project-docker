import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
    });
  }

  async findAll(query) {
    const { search, sortBy, sortOrder, page, limit } = query;
    const skip = (page - 1) * limit;
    
    return this.prisma.category.findMany({
      where: { name: { contains: search || '' } },
      orderBy: { [sortBy || 'name']: sortOrder || 'asc' },
      skip: +skip,
      take: +limit,
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
