import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';
import { UsuarioRol } from 'src/core/enums/rol.enum';

export class CreateUsuarioDto {
  @IsNumber()
  @IsPositive()
  numeroMita: number;

  @IsString()
  @MinLength(1)
  nombre: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.',
  })
  password: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsEnum(UsuarioRol)
  @IsOptional()
  rol: UsuarioRol = UsuarioRol.MUSICO;

  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;

  @IsString()
  @IsUrl()
  @IsOptional()
  foto?: string;
}
