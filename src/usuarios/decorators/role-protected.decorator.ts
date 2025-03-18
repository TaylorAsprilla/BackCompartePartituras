import { SetMetadata } from '@nestjs/common';
import { META_ROLES } from 'src/core/constantes';
import { UsuarioRol } from 'src/core/enums/rol.enum';

export const RoleProtected = (...args: UsuarioRol[]) => {
  return SetMetadata(META_ROLES, args);
};
