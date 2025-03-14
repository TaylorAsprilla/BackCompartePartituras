import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticPartitura(filename: string) {
    const path = join(__dirname, '../../static/partituras', filename);

    if (!existsSync(path))
      throw new BadRequestException(`No existe el archivo ${filename}`);

    return path;
  }
}
