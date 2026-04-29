import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { KursiService } from './kursi.service';
import { CreateKursiDto } from './dto/create-kursi.dto';
import { UpdateKursiDto } from './dto/update-kursi.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Kursi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('kursi')
export class KursiController {
  constructor(private kursiService: KursiService) {}

  // Pelanggan bisa lihat semua kursi
  @Get()
  @ApiOperation({ summary: 'Get all kursi' })
  findAll() {
    return this.kursiService.findAll();
  }

  // Kursi tersedia berdasarkan jadwal
  // GET /kursi/tersedia?id_jadwal=1
  // GET /kursi/tersedia?id_jadwal=1&id_gerbong=2
  @Get('tersedia')
  @ApiOperation({
    summary: 'Get available kursi by jadwal (and optional gerbong)',
  })
  findTersedia(
    @Query('id_jadwal') id_jadwal: string,
    @Query('id_gerbong') id_gerbong?: string,
  ) {
    if (id_gerbong) {
      return this.kursiService.findTersediaByJadwalDanGerbong(
        +id_jadwal,
        +id_gerbong,
      );
    }
    return this.kursiService.findTersediaByJadwal(+id_jadwal);
  }

  // Kursi yang sudah dipesan berdasarkan jadwal
  // GET /kursi/dipesan?id_jadwal=1
  @Get('dipesan')
  @ApiOperation({ summary: 'Get booked kursi by jadwal' })
  findDipesan(@Query('id_jadwal') id_jadwal: string) {
    return this.kursiService.findDipesanByJadwal(+id_jadwal);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a kursi by ID' })
  findOne(@Param('id') id: string) {
    return this.kursiService.findOne(+id);
  }

  // Hanya admin (petugas) yang bisa CUD
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new kursi' })
  create(@Body() dto: CreateKursiDto) {
    return this.kursiService.create(dto);
  }

  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a kursi by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateKursiDto) {
    return this.kursiService.update(+id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a kursi by ID' })
  remove(@Param('id') id: string) {
    return this.kursiService.remove(+id);
  }
}
