import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile 
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  @ApiOperation({ summary: 'Fayl yuklash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Fayl muvaffaqiyatli yuklandi.' })
  @ApiResponse({ status: 400, description: 'Notogri malumot.' })
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename(req, file, cb) {
        const fileName = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, fileName);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = `https://63.178.1.1:4000/uploads/${file.filename}`;
    return { fileUrl };
  }
}