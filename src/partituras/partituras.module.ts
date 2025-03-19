import { Module } from '@nestjs/common';
import { PartiturasService } from './partituras.service';
import { PartiturasController } from './partituras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partitura } from './entities/partitura.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [PartiturasController],
  providers: [PartiturasService],
  imports: [TypeOrmModule.forFeature([Partitura]), UsuariosModule],
})
export class PartiturasModule {}
