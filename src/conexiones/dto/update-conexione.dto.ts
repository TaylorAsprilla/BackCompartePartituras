import { PartialType } from '@nestjs/swagger';
import { CreateConexioneDto } from './create-conexione.dto';

export class UpdateConexioneDto extends PartialType(CreateConexioneDto) {}
