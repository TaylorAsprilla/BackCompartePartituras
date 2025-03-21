import { Module } from '@nestjs/common';
import { PartiturasService } from './partituras.service';
import { PartiturasController } from './partituras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partitura } from './entities/partitura.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { FilesModule } from 'src/files/files.module';
import { InstrumentosModule } from 'src/instrumentos/instrumentos.module';

@Module({
  controllers: [PartiturasController],
  providers: [PartiturasService],
  imports: [
    TypeOrmModule.forFeature([Partitura]),
    UsuariosModule,
    CategoriasModule,
    FilesModule,
    InstrumentosModule,
  ],
})
export class PartiturasModule {}
