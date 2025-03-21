import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class LoginUsuarioDto {
  @ApiProperty({
    description:
      'Número Mita del usuario. Se requiere si no se proporciona el correo electrónico.',
    example: 12345,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ValidateIf((value: LoginUsuarioDto) => value.email === undefined)
  numeroMita?: number;

  @ApiProperty({
    description:
      'Correo electrónico del usuario. Se requiere si no se proporciona el número Mita.',
    example: 'juan.perez@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  @ValidateIf((value: LoginUsuarioDto) => value.numeroMita === undefined)
  email?: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
  })
  @IsString()
  password: string;
}
