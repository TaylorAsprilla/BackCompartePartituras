import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/core/constantes';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class UsuarioRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    const req = context.switchToHttp().getRequest<{ user: Usuario }>();
    const usuario = req.user;

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (validRoles.length === 0) {
      return true; // Si no se definen roles válidos, permitir el acceso
    }

    if (validRoles.includes(usuario.rol)) {
      return true;
    }

    throw new ForbiddenException('No tienes permisos para acceder a esta ruta');
  }
}
