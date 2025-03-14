import { PartialType } from '@nestjs/mapped-types';
import { CreatePartituraDto } from './create-partitura.dto';

export class UpdatePartituraDto extends PartialType(CreatePartituraDto) {}
