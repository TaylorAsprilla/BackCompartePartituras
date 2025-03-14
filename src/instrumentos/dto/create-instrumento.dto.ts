import { IsString, MinLength } from 'class-validator';

export class CreateInstrumentoDto {
  @IsString()
  @MinLength(1)
  nombre: string;
}
