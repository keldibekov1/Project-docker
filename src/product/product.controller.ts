import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Product')
@Controller('products')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Yangi mahsulot yaratish' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Mahsulot yaratildi' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN', 'USER')
  @UseInterceptors(CacheInterceptor) 
  @ApiOperation({ summary: 'Barcha mahsulotlarni olish (filter, sort, pagination)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sortBy', required: false, example: 'name' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'asc' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query() query) {
    return this.productService.findAll(query);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Mahsulotni yangilash' })
  @ApiParam({ name: 'id', description: 'Mahsulot IDsi' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Mahsulot yangilandi' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Mahsulotni ochirish' })
  @ApiParam({ name: 'id', description: 'Mahsulot IDsi' })
  @ApiResponse({ status: 200, description: 'Mahsulot ochirildi' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
