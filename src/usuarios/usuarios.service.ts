import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dtp';
import { LoginUsuarioDto } from './dto';
import { JwtPayLoad } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConexionesService } from 'src/conexiones/conexiones.service';

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
    private readonly jwtService: JwtService,
    private readonly conexionesService: ConexionesService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto, registradoPor: Usuario) {
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
      const { password, ...userData } = createUsuarioDto;

      const usuario = this.usuarioRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        registradoPor,
      });

      await this.usuarioRepository.save(usuario);

      return {
        ...usuario,
        token: this.getJwtToken({
          id: usuario.id,
          numeroMita: usuario.numeroMita,
        }),
      };
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
    registradoPor: Usuario,
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

    // Verificar si el email ya está registrado por otro usuario
    if (updateUsuarioDto.email) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { email: updateUsuarioDto.email },
      });
      if (existingUser && existingUser.id !== usuario.id) {
        throw new BadRequestException(
          'El email ya está registrado por otro usuario',
        );
      }
    }

    // Verificar si el número Mita ya está registrado por otro usuario
    if (updateUsuarioDto.numeroMita) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { numeroMita: updateUsuarioDto.numeroMita },
      });
      if (existingUser && existingUser.id !== usuario.id) {
        throw new BadRequestException(
          'El número Mita ya está registrado por otro usuario',
        );
      }
    }

    try {
      // Actualizar el usuario con los datos proporcionados
      const usuarioActualizado = await this.usuarioRepository.preload({
        id: usuario.id, // Asegurar que el ID se mantenga
        ...updateUsuarioDto,
        registradoPor,
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

  async login(loginUsuarioDto: LoginUsuarioDto, ip: string | undefined) {
    const { numeroMita, email, password } = loginUsuarioDto;

    let usuario: Usuario | null;

    if (email) {
      usuario = await this.usuarioRepository.findOne({
        where: { email },
        select: { password: true, email: true, id: true },
      });
    } else if (numeroMita) {
      usuario = await this.usuarioRepository.findOne({
        where: { numeroMita },
        select: { password: true, numeroMita: true, id: true },
      });
    } else {
      throw new BadRequestException('Debe proporcionar email o número Mita');
    }

    if (!usuario) {
      throw new NotFoundException('Credenciales no válidas');
    }

    const isPasswordValid = bcrypt.compareSync(password, usuario.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Credenciales no válidas');
    }

    await this.conexionesService.getGeolocalizacionData(ip, usuario);

    // Retornar el JWT de acceso
    return {
      ...usuario,
      token: this.getJwtToken({
        id: usuario.id,
        numeroMita: usuario.numeroMita,
      }),
    };
  }

  checkAuthStatus(usuario: Usuario) {
    return {
      ...usuario,
      token: this.getJwtToken({
        id: usuario.id,
        numeroMita: usuario.numeroMita,
      }),
    };
  }

  private getJwtToken(payload: JwtPayLoad) {
    const token = this.jwtService.sign(payload);
    return token;
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
