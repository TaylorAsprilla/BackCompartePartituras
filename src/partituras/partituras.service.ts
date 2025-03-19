import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartituraDto } from './dto/create-partitura.dto';
import { UpdatePartituraDto } from './dto/update-partitura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partitura } from './entities/partitura.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class PartiturasService {
  constructor(
    @InjectRepository(Partitura)
    private readonly partituraRepository: Repository<Partitura>,
  ) {}

  async create(
    createPartituraDto: CreatePartituraDto,
    usuario: Usuario,
  ): Promise<Partitura> {
    const partitura = this.partituraRepository.create({
      ...createPartituraDto,
      usuario,
    });
    return await this.partituraRepository.save(partitura);
  }

  async findAll(): Promise<Partitura[]> {
    return await this.partituraRepository.find();
  }

  async findOne(id: number): Promise<Partitura> {
    const partitura = await this.partituraRepository.findOneBy({ id });
    if (!partitura) {
      throw new NotFoundException(`Partitura with ID ${id} not found`);
    }
    return partitura;
  }

  async update(
    id: number,
    updatePartituraDto: UpdatePartituraDto,
    usuario: Usuario,
  ): Promise<Partitura> {
    const partitura = await this.partituraRepository.preload({
      id,
      ...updatePartituraDto,
    });
    if (!partitura) {
      throw new NotFoundException(`Partitura with ID ${id} not found`);
    }
    partitura.usuario = usuario;
    return await this.partituraRepository.save(partitura);
  }

  async remove(id: number): Promise<void> {
    const partitura = await this.findOne(id);
    await this.partituraRepository.remove(partitura);
  }
}
