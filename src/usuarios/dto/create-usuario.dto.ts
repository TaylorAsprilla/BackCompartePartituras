import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UsuarioRol } from 'src/core/enums/rol.enum';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Número Mita del usuario',
    example: 12345,
  })
  @IsNumber()
  @IsPositive()
  numeroMita: number;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
  })
  @IsString()
  @MinLength(1)
  nombre: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
    minLength: 8,
    pattern: '(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*',
  })
  @IsString()
  @MinLength(8)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.',
  })
  password: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UsuarioRol,
    default: UsuarioRol.MUSICO,
    example: UsuarioRol.MUSICO,
  })
  @IsEnum(UsuarioRol)
  @IsOptional()
  rol: UsuarioRol = UsuarioRol.MUSICO;

  @ApiProperty({
    description: 'Estado activo del usuario',
    default: true,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;

  @ApiProperty({
    description: 'Foto del usuario',
    required: false,
    example: 'https://example.com/foto.jpg',
  })
  @IsString()
  @IsOptional()
  foto?: string;

  @ApiProperty({
    description: 'ID del usuario que registró a este usuario',
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  registradoPor?: number;

  @ApiProperty({
    description: 'Token de restablecimiento de contraseña',
    required: false,
    example: 'some-random-token',
  })
  @IsString()
  @IsOptional()
  resetToken?: string;
}
