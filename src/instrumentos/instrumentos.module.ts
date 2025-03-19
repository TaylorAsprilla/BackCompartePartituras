import { Module } from '@nestjs/common';
import { InstrumentosService } from './instrumentos.service';
import { InstrumentosController } from './instrumentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrumento } from './entities/instrumento.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [InstrumentosController],
  providers: [InstrumentosService],
  imports: [TypeOrmModule.forFeature([Instrumento]), UsuariosModule],
})
export class InstrumentosModule {}
