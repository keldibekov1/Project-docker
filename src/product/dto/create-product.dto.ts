import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Mahsulot nomi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Eng so‘ngi model, 256GB, Titanium', description: 'Mahsulot haqida' })
  @IsString()
  description: string;

  @ApiProperty({ example: 199999, description: 'Narxi (sum)' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'c3f4a5d2-31de-4f4b-b13c-874ac9223a5b', description: 'Kategoriya IDsi' })
  @IsString()
  categoryId: string;
}
