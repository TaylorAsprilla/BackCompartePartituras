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
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { PaginationDto } from 'src/common/dtos/pagination.dtp';
import { CreateUsuarioDto, LoginUsuarioDto, UpdateUsuarioDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Usuario } from './entities/usuario.entity';
import { GetUsuario, RawHeaders } from './decorators';
import { Request } from 'express';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('register')
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Post('login')
  loginUser(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.usuariosService.login(loginUsuarioDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usuariosService.findAll(paginationDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Request,
    @GetUsuario() usuario: Usuario,
    @GetUsuario('email') usuarioEmail: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      message: 'Petición exitosa',
      usuario,
      usuarioEmail,
      rawHeaders,
    };
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.usuariosService.findOne(term);
  }

  @Patch(':numeroMita')
  update(
    @Param('numeroMita', ParseIntPipe) numeroMita: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(+numeroMita, updateUsuarioDto);
  }

  @Delete(':numeroMita')
  remove(@Param('numeroMita') numeroMita: string) {
    return this.usuariosService.remove(+numeroMita);
  }
}
