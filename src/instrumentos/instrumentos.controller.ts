import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InstrumentosService } from './instrumentos.service';
import { CreateInstrumentoDto } from './dto/create-instrumento.dto';
import { UpdateInstrumentoDto } from './dto/update-instrumento.dto';
import { Auth } from 'src/usuarios/decorators';
import { UsuarioRol } from 'src/core/enums/rol.enum';

@Controller('instrumentos')
@Auth()
export class InstrumentosController {
  constructor(private readonly instrumentosService: InstrumentosService) {}

  @Post()
  @Auth(UsuarioRol.ADMIN, UsuarioRol.ARCHIVO)
  create(@Body() createInstrumentoDto: CreateInstrumentoDto) {
    return this.instrumentosService.create(createInstrumentoDto);
  }

  @Get()
  findAll() {
    return this.instrumentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instrumentosService.findOne(+id);
  }

  @Patch(':id')
  @Auth(UsuarioRol.ADMIN, UsuarioRol.ARCHIVO)
  update(
    @Param('id') id: string,
    @Body() updateInstrumentoDto: UpdateInstrumentoDto,
  ) {
    return this.instrumentosService.update(+id, updateInstrumentoDto);
  }

  @Delete(':id')
  @Auth(UsuarioRol.ADMIN, UsuarioRol.ARCHIVO)
  remove(@Param('id') id: string) {
    return this.instrumentosService.remove(+id);
  }
}
