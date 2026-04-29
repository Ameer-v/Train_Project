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
import { PelangganService } from './pelanggan.service';
import { CreatePelangganDto } from './dto/create-pelanggan.dto';
import { UpdatePelangganDto } from './dto/update-pelanggan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Pelanggan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pelanggan')
export class PelangganController {
  constructor(private pelangganService: PelangganService) {}

  // Petugas bisa membuat data pelanggan baru
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new pelanggan' })
  create(@Body() dto: CreatePelangganDto) {
    return this.pelangganService.create(dto);
  }

  // Hanya petugas (admin) yang bisa melihat semua pelanggan
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Get all pelanggan' })
  findAll() {
    return this.pelangganService.findAll();
  }

  @Roles('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Get a pelanggan by ID' })
  findOne(@Param('id') id: string) {
    return this.pelangganService.findOne(+id);
  }

  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a pelanggan by ID' })
  update(@Param('id') id: string, @Body() dto: UpdatePelangganDto) {
    return this.pelangganService.update(+id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pelanggan by ID' })
  remove(@Param('id') id: string) {
    return this.pelangganService.remove(+id);
  }
}
