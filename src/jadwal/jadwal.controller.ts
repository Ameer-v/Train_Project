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
import { JadwalService } from './jadwal.service';
import { CreateJadwalDto } from './dto/create-jadwal.dto';
import { UpdateJadwalDto } from './dto/update-jadwal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Jadwal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jadwal')
export class JadwalController {
  constructor(private jadwalService: JadwalService) {}

  // Semua user (pelanggan & petugas) bisa lihat jadwal
  @Get()
  @ApiOperation({ summary: 'Get all jadwals' })
  findAll() {
    return this.jadwalService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a jadwal by ID' })
  findOne(@Param('id') id: string) {
    return this.jadwalService.findOne(+id);
  }

  // Hanya admin (petugas) yang bisa CUD
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new jadwal' })
  create(@Body() dto: CreateJadwalDto) {
    return this.jadwalService.create(dto);
  }

  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a jadwal by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateJadwalDto) {
    return this.jadwalService.update(+id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a jadwal by ID' })
  remove(@Param('id') id: string) {
    return this.jadwalService.remove(+id);
  }
}
