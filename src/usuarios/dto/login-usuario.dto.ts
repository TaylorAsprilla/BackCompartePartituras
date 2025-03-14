import {
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginUsuarioDto {
  @IsNumber()
  @IsPositive()
  numeroMita: number;

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
}
