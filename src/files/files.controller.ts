import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('partitura/:filename')
  findPartitura(@Res() res: Response, @Param('filename') filename: string) {
    const path = this.filesService.getStaticPartitura(filename);

    res.sendFile(path);
  }

  @Post('partitura')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
      storage: diskStorage({
        destination: './static/partituras',
        filename: fileNamer,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/partituras/${file.filename}`;

    return { secureUrl };
  }
}
