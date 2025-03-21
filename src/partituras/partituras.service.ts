import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePartituraDto } from './dto/create-partitura.dto';
import { UpdatePartituraDto } from './dto/update-partitura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partitura } from './entities/partitura.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Instrumento } from 'src/instrumentos/entities/instrumento.entity';

@Injectable()
export class PartiturasService {
  constructor(
    @InjectRepository(Partitura)
    private readonly partituraRepository: Repository<Partitura>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Instrumento)
    private readonly instrumentoRepository: Repository<Instrumento>,
  ) {}

  async create(
    createPartituraDto: CreatePartituraDto,
    file: string,
    usuario: Usuario,
  ): Promise<Partitura> {
    const { categoriaId, instrumentoId } = createPartituraDto;

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const categoria = await this.categoriaRepository.findOneBy({
      id: categoriaId,
    });
    if (!categoria) {
      throw new NotFoundException(
        `Categoría con ID ${categoriaId} no encontrada`,
      );
    }

    const instrumento = await this.instrumentoRepository.findOneBy({
      id: instrumentoId,
    });
    if (!instrumento) {
      throw new NotFoundException(
        `El instrumento con ID ${instrumentoId} no se encuentra`,
      );
    }

    const partitura = this.partituraRepository.create({
      ...createPartituraDto,
      pdf_url: file,
      usuario,
      categoria,
      instrumento,
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
