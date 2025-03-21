import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { PartiturasService } from './partituras.service';
import { CreatePartituraDto } from './dto/create-partitura.dto';
import { UpdatePartituraDto } from './dto/update-partitura.dto';
import { Auth, GetUsuario } from 'src/usuarios/decorators';
import { UsuarioRol } from 'src/core/enums/rol.enum';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from 'src/files/helpers';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';

@Controller('partituras')
@Auth()
export class PartiturasController {
  constructor(
    private readonly partiturasService: PartiturasService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @Auth(UsuarioRol.ADMIN, UsuarioRol.ARCHIVO)
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
  create(
    @Body() createPartituraDto: CreatePartituraDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUsuario() usuario: Usuario,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/partituras/${file.filename}`;

    return this.partiturasService.create(
      createPartituraDto,
      secureUrl,
      usuario,
    );
  }

  @Get()
  @Auth(
    UsuarioRol.ADMIN,
    UsuarioRol.ARCHIVO,
    UsuarioRol.DIRECTOR,
    UsuarioRol.MUSICO,
  )
  findAll() {
    return this.partiturasService.findAll();
  }

  @Get(':id')
  @Auth(
    UsuarioRol.ADMIN,
    UsuarioRol.ARCHIVO,
    UsuarioRol.DIRECTOR,
    UsuarioRol.MUSICO,
  )
  findOne(@Param('id') id: string) {
    return this.partiturasService.findOne(+id);
  }

  @Patch(':id')
  @Auth(UsuarioRol.ADMIN, UsuarioRol.ARCHIVO)
  update(
    @Param('id') id: string,
    @Body() updatePartituraDto: UpdatePartituraDto,
    @GetUsuario() usuario: Usuario,
  ) {
    return this.partiturasService.update(+id, updatePartituraDto, usuario);
  }

  @Delete(':id')
  @Auth(UsuarioRol.ADMIN, UsuarioRol.ARCHIVO)
  remove(@Param('id') id: string) {
    return this.partiturasService.remove(+id);
  }
}
