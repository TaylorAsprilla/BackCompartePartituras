import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInstrumentoDto } from './dto/create-instrumento.dto';
import { UpdateInstrumentoDto } from './dto/update-instrumento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrumento } from './entities/instrumento.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstrumentosService {
  constructor(
    @InjectRepository(Instrumento)
    private readonly instrumentoRepository: Repository<Instrumento>,
  ) {}

  async create(createInstrumentoDto: CreateInstrumentoDto) {
    const existingInstrumento = await this.instrumentoRepository.findOne({
      where: { nombre: createInstrumentoDto.nombre },
    });

    if (existingInstrumento) {
      throw new ConflictException(
        `El instrumento con el nombre <b>${createInstrumentoDto.nombre}</b> ya existe`,
      );
    }

    const instrumento = this.instrumentoRepository.create(createInstrumentoDto);
    return await this.instrumentoRepository.save(instrumento);
  }

  async findAll() {
    return await this.instrumentoRepository.find();
  }

  async findOne(id: number) {
    const instrumento = await this.instrumentoRepository.findOne({
      where: { id },
    });
    if (!instrumento) {
      throw new NotFoundException(`Instrumento with ID ${id} not found`);
    }
    return instrumento;
  }

  async update(id: number, updateInstrumentoDto: UpdateInstrumentoDto) {
    const existingInstrumento = await this.instrumentoRepository.findOne({
      where: { nombre: updateInstrumentoDto.nombre },
    });

    if (existingInstrumento && existingInstrumento.id !== id) {
      throw new ConflictException(
        `El instrumento con el nombre <b>${updateInstrumentoDto.nombre}</b> ya existe`,
      );
    }

    const instrumento = await this.instrumentoRepository.preload({
      id,
      ...updateInstrumentoDto,
    });
    if (!instrumento) {
      throw new NotFoundException(`Instrumento with ID ${id} not found`);
    }
    return await this.instrumentoRepository.save(instrumento);
  }

  async remove(id: number) {
    const instrumento = await this.findOne(id);
    await this.instrumentoRepository.remove(instrumento);
  }
}
