import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dtp';
import { ConfigService } from '@nestjs/config';

interface DBError {
  code: string;
  detail: string;
  message: string;
  stack?: string;
}

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger('UsuariosService');

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly configService: ConfigService,
  ) {
    console.log(configService.get('PORT'), process.env.PORT);
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verificar si el email ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { email: createUsuarioDto.email },
    });

    const existeNumeroMita = await this.usuarioRepository.findOne({
      where: { numeroMita: createUsuarioDto.numeroMita },
    });

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    if (existeNumeroMita) {
      throw new BadRequestException(
        'El feligrés con el número Mita ya está registrado',
      );
    }

    try {
      const usuario = this.usuarioRepository.create(createUsuarioDto);
      await this.usuarioRepository.save(usuario);
      return usuario;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Usuario[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    const usuarios = await this.usuarioRepository.find({
      where: { isActive: true },
      take: limit,
      skip: offset,
      relations: ['rol'], // Cargar relaciones (ajusta según tu entidad)
      order: { fecha_creacion: 'DESC' }, // Ordenar por fecha de creación (opcional)
    });

    if (usuarios.length === 0) {
      throw new NotFoundException('No se encontraron usuarios activos');
    }

    return usuarios;
  }

  async findOne(term: string): Promise<Usuario> {
    let usuario: Usuario | null;

    if (isNaN(Number(term))) {
      // Buscar por email
      usuario = await this.usuarioRepository.findOne({
        where: { email: term },
      });
    } else {
      // Buscar por número Mita
      usuario = await this.usuarioRepository.findOne({
        where: { numeroMita: Number(term) },
      });
    }

    if (!usuario) {
      throw new NotFoundException(
        `El usuario con el término ${term} no existe`,
      );
    }

    return usuario;
  }

  async update(
    numeroMita: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    // Verificar si el usuario existe
    const usuario = await this.usuarioRepository.findOne({
      where: { numeroMita },
    });

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con el número Mita ${numeroMita} no existe`,
      );
    }

    try {
      // Actualizar el usuario con los datos proporcionados
      const usuarioActualizado = await this.usuarioRepository.preload({
        id: usuario.id, // Asegurar que el ID se mantenga
        ...updateUsuarioDto,
      });

      if (!usuarioActualizado) {
        throw new InternalServerErrorException(
          'Error al actualizar el usuario. Verifique los datos proporcionados',
        );
      }

      // Guardar el usuario actualizado
      await this.usuarioRepository.save(usuarioActualizado);

      return usuarioActualizado;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(numeroMita: number): Promise<{ message: string }> {
    try {
      const usuario = await this.usuarioRepository.findOneBy({ numeroMita });

      if (!usuario) {
        throw new NotFoundException(
          `Usuario con el número Mita ${numeroMita} no existe`,
        );
      }

      await this.usuarioRepository.remove(usuario);

      return {
        message: `Usuario con el número Mita ${numeroMita} eliminado`,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: unknown): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as DBError).code === '23505'
    ) {
      // Error de duplicado (violación de restricción única)
      const dbError = error as DBError;
      this.logger.warn(`Intento de duplicado: ${dbError.detail}`);
      throw new BadRequestException(dbError.detail);
    } else {
      // Otros errores de base de datos
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(`Error inesperado: ${errorMessage}`, errorStack);
      throw new InternalServerErrorException(
        'Error al procesar la solicitud. Verifique los logs del servidor',
      );
    }
  }
}
