import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class LoginUsuarioDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ValidateIf((value: LoginUsuarioDto) => value.email === undefined)
  numeroMita?: number;

  @IsOptional()
  @IsString()
  @IsEmail()
  @ValidateIf((value: LoginUsuarioDto) => value.numeroMita === undefined)
  email?: string;

  @IsString()
  password: string;
}
