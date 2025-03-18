import { applyDecorators, UseGuards } from '@nestjs/common';
import { UsuarioRol } from 'src/core/enums/rol.enum';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioRoleGuard } from '../guards/usuario-role/usuario-role.guard';

export function Auth(...roles: UsuarioRol[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UsuarioRoleGuard),
  );
}
