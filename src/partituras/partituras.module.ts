import { Module } from '@nestjs/common';
import { PartiturasService } from './partituras.service';
import { PartiturasController } from './partituras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partitura } from './entities/partitura.entity';

@Module({
  controllers: [PartiturasController],
  providers: [PartiturasService],
  imports: [TypeOrmModule.forFeature([Partitura])],
})
export class PartiturasModule {}
