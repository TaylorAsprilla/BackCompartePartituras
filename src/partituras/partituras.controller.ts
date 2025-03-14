import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PartiturasService } from './partituras.service';
import { CreatePartituraDto } from './dto/create-partitura.dto';
import { UpdatePartituraDto } from './dto/update-partitura.dto';

@Controller('partituras')
export class PartiturasController {
  constructor(private readonly partiturasService: PartiturasService) {}

  @Post()
  create(@Body() createPartituraDto: CreatePartituraDto) {
    return this.partiturasService.create(createPartituraDto);
  }

  @Get()
  findAll() {
    return this.partiturasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partiturasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartituraDto: UpdatePartituraDto) {
    return this.partiturasService.update(+id, updatePartituraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partiturasService.remove(+id);
  }
}
