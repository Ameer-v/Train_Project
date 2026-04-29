import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { KeretaService } from './kereta.service';
import { CreateKeretaDto } from './dto/create-kereta.dto';
import { UpdateKeretaDto } from './dto/update-kereta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Kereta')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('kereta')
export class KeretaController {
  constructor(private keretaService: KeretaService) {}

  // Pelanggan bisa lihat kereta (untuk pilih jadwal)
  @Get()
  @ApiOperation({ summary: 'Get all kereta' })
  findAll() {
    return this.keretaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a kereta by ID' })
  findOne(@Param('id') id: string) {
    return this.keretaService.findOne(+id);
  }

  // Hanya admin (petugas) yang bisa CUD
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new kereta' })
  create(@Body() dto: CreateKeretaDto) {
    return this.keretaService.create(dto);
  }

  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a kereta by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateKeretaDto) {
    return this.keretaService.update(+id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a kereta by ID' })
  remove(@Param('id') id: string) {
    return this.keretaService.remove(+id);
  }
}
