import { Controller, Get, Req } from '@nestjs/common';
import { ConexionesService } from './conexiones.service';
import { Conexion } from './entities/conexion.entity';
import { Request } from 'express';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Controller('conexiones')
export class ConexionesController {
  constructor(private readonly conexionesService: ConexionesService) {}

  @Get()
  getGeoData(@Req() request: Request, usuario: Usuario): Promise<Conexion> {
    const ip = request.ip || '1';
    return this.conexionesService.getGeolocalizacionData(ip, usuario);
  }
}
