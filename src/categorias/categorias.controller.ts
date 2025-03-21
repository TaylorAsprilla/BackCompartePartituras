import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Auth } from 'src/usuarios/decorators';
import { UsuarioRol } from 'src/core/enums/rol.enum';

@Controller('categorias')
@Auth()
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @Auth(UsuarioRol.ADMIN, UsuarioRol.ARCHIVO)
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  @Auth(UsuarioRol.ADMIN, UsuarioRol.ARCHIVO)
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  @Auth(UsuarioRol.ADMIN, UsuarioRol.ARCHIVO)
  findOne(@Param('id') id: string) {
    return this.categoriasService.findOne(+id);
  }

  @Patch(':id')
  @Auth(UsuarioRol.ADMIN, UsuarioRol.ARCHIVO)
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(+id, updateCategoriaDto);
  }

  @Delete(':id')
  @Auth(UsuarioRol.ADMIN, UsuarioRol.ARCHIVO)
  remove(@Param('id') id: string) {
    return this.categoriasService.remove(+id);
  }
}
