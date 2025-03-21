import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePartituraDto {
  @ApiProperty({
    description: 'Título de la partitura',
    example: 'Sinfonía No. 5',
  })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({
    description: 'URL del archivo PDF de la partitura',
    example: 'https://example.com/partitura.pdf',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  pdf_url: string;

  @ApiProperty({
    description: 'ID de la categoría de la partitura',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Transform(({ value }: { value: string }) => parseInt(value, 10)) // Convierte el valor a número
  categoriaId: number;

  @ApiProperty({
    description: 'ID de la categoría de la partitura',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Transform(({ value }: { value: string }) => parseInt(value, 10)) // Convierte el valor a número
  instrumentoId: number;
}
