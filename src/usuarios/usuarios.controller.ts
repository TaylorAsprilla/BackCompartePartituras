import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { PaginationDto } from 'src/common/dtos/pagination.dtp';
import { CreateUsuarioDto, LoginUsuarioDto, UpdateUsuarioDto } from './dto';
import { Auth } from './decorators';
import { UsuarioRol } from 'src/core/enums/rol.enum';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('register')
  @Auth(UsuarioRol.ADMIN)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Post('login')
  loginUser(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.usuariosService.login(loginUsuarioDto);
  }

  @Get()
  @Auth(UsuarioRol.ADMIN)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usuariosService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth(UsuarioRol.ADMIN)
  findOne(@Param('term') term: string) {
    return this.usuariosService.findOne(term);
  }

  @Patch(':numeroMita')
  @Auth(UsuarioRol.ADMIN)
  update(
    @Param('numeroMita', ParseIntPipe) numeroMita: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(+numeroMita, updateUsuarioDto);
  }

  @Delete(':numeroMita')
  @Auth(UsuarioRol.ADMIN)
  remove(@Param('numeroMita') numeroMita: string) {
    return this.usuariosService.remove(+numeroMita);
  }
}
