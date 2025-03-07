import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [ConfigModule, TypeOrmModule.forFeature([Usuario])],
})
export class UsuariosModule {}
