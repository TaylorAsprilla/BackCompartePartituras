import { Module } from '@nestjs/common';
import { InstrumentosService } from './instrumentos.service';
import { InstrumentosController } from './instrumentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrumento } from './entities/instrumento.entity';

@Module({
  controllers: [InstrumentosController],
  providers: [InstrumentosService],
  imports: [TypeOrmModule.forFeature([Instrumento])],
})
export class InstrumentosModule {}
