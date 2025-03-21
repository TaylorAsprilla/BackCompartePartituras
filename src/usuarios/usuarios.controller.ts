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
  Req,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { PaginationDto } from 'src/common/dtos/pagination.dtp';
import { CreateUsuarioDto, LoginUsuarioDto, UpdateUsuarioDto } from './dto';
import { Auth, GetUsuario } from './decorators';
import { UsuarioRol } from 'src/core/enums/rol.enum';
import { Usuario } from './entities/usuario.entity';
import { ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('register')
  @Auth(UsuarioRol.ADMIN)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Usuario,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @GetUsuario() usuario: Usuario,
  ) {
    return this.usuariosService.create(createUsuarioDto, usuario);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    type: Usuario,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async loginUser(
    @Body() loginUsuarioDto: LoginUsuarioDto,
    @Req() request: Request,
  ) {
    const ip = request.ip;

    return await this.usuariosService.login(loginUsuarioDto, ip);
  }

  @Get('check-status')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'User status checked successfully.',
    type: Usuario,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  checkAuthStatus(@GetUsuario() usuario: Usuario) {
    return this.usuariosService.checkAuthStatus(usuario);
  }

  @Get()
  @Auth(UsuarioRol.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
    type: [Usuario],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usuariosService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth(UsuarioRol.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findOne(@Param('term') term: string) {
    return this.usuariosService.findOne(term);
  }

  @Patch(':numeroMita')
  @Auth(UsuarioRol.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  update(
    @Param('numeroMita', ParseIntPipe) numeroMita: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @GetUsuario() usuario: Usuario,
  ) {
    return this.usuariosService.update(+numeroMita, updateUsuarioDto, usuario);
  }

  @Delete(':numeroMita')
  @Auth(UsuarioRol.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  remove(@Param('numeroMita') numeroMita: string) {
    return this.usuariosService.remove(+numeroMita);
  }
}
