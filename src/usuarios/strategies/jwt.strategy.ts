import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { JwtPayLoad } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET') || 'asb123lko',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayLoad): Promise<Usuario> {
    const { id, numeroMita } = payload;

    let usuario: Usuario | null;

    if (id) {
      usuario = await this.usuarioRepository.findOne({
        where: { id },
      });
    } else if (numeroMita) {
      usuario = await this.usuarioRepository.findOne({
        where: { numeroMita },
      });
    } else {
      throw new UnauthorizedException('Token inválido');
    }

    if (!usuario) {
      throw new UnauthorizedException('Token inválido');
    }

    if (!usuario.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return usuario;
  }
}
