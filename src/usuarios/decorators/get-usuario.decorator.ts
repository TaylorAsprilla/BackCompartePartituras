import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Usuario } from '../entities/usuario.entity';

export const GetUsuario = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<{ user: Usuario }>();

    const usuario = req.user;

    if (!usuario)
      throw new InternalServerErrorException('Usuario no encontrado');

    return !data ? usuario : usuario[data as keyof Usuario];
  },
);
