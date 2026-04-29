import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PembelianTiketService } from './pembelian-tiket.service';
import { CreatePembelianTiketDto } from './dto/create-pembelian-tiket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Pembelian Tiket')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pembelian-tiket')
export class PembelianTiketController {
  constructor(private pembelianTiketService: PembelianTiketService) {}

  // Pelanggan pesan tiket
  @Roles('penumpang')
  @Post()
  @ApiOperation({ summary: 'Create a new pembelian tiket' })
  create(@Body() dto: CreatePembelianTiketDto, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.pembelianTiketService.create(dto, req.user.userId);
  }

  // Pelanggan lihat histori pemesanan miliknya
  @Roles('penumpang')
  @Get('histori')
  @ApiOperation({
    summary: 'Get pembelian tiket history for the logged-in pelanggan',
  })
  historiPelanggan(
    @Request() req,
    @Query('tanggal') tanggal?: string,
    @Query('bulan') bulan?: string,
    @Query('tahun') tahun?: string,
  ) {
    return this.pembelianTiketService.findByPelanggan(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.userId,
      tanggal,
      bulan,
      tahun,
    );
  }

  // Petugas lihat semua histori transaksi
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Get all pembelian tiket history' })
  findAll(
    @Query('tanggal') tanggal?: string,
    @Query('bulan') bulan?: string,
    @Query('tahun') tahun?: string,
  ) {
    return this.pembelianTiketService.findAll(tanggal, bulan, tahun);
  }

  // Petugas lihat rekap pemasukan perbulan
  @Roles('admin')
  @Get('rekap/:tahun')
  @ApiOperation({ summary: 'Get monthly revenue recap for a given year' })
  rekapPerBulan(@Param('tahun') tahun: string) {
    return this.pembelianTiketService.rekapPerBulan(tahun);
  }

  // Lihat detail tiket (untuk cetak nota) — harus di bawah route statis
  @Get(':id')
  @ApiOperation({ summary: 'Get a pembelian tiket by ID' })
  findOne(@Param('id') id: string) {
    return this.pembelianTiketService.findOne(+id);
  }
}
