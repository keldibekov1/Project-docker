import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Monitorlar', description: 'Kategoriya nomi' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Gaming Monitorlar', description: 'Yangi kategoriya nomi' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
