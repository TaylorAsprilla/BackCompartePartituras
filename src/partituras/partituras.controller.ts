import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PartiturasService } from './partituras.service';
import { CreatePartituraDto } from './dto/create-partitura.dto';
import { UpdatePartituraDto } from './dto/update-partitura.dto';
import { Auth, GetUsuario } from 'src/usuarios/decorators';
import { UsuarioRol } from 'src/core/enums/rol.enum';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Controller('partituras')
@Auth()
export class PartiturasController {
  constructor(private readonly partiturasService: PartiturasService) {}

  @Post()
  @Auth(UsuarioRol.ADMIN, UsuarioRol.ARCHIVO)
  create(
    @Body() createPartituraDto: CreatePartituraDto,
    @GetUsuario() usuario: Usuario,
  ) {
    return this.partiturasService.create(createPartituraDto, usuario);
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
