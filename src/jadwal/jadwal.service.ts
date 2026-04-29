import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJadwalDto } from './dto/create-jadwal.dto';
import { UpdateJadwalDto } from './dto/update-jadwal.dto';

@Injectable()
export class JadwalService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateJadwalDto) {
    return this.prisma.jadwal.create({
      data: {
        ...dto,
        tanggal_berangkat: new Date(dto.tanggal_berangkat),
        tanggal_kedatangan: new Date(dto.tanggal_kedatangan),
      },
    });
  }

  findAll() {
    return this.prisma.jadwal.findMany({ include: { kereta: true } });
  }

  async findOne(id: number) {
    const data = await this.prisma.jadwal.findUnique({
      where: { id },
      include: { kereta: true },
    });
    if (!data) throw new NotFoundException('Jadwal tidak ditemukan');
    return data;
  }

  async update(id: number, dto: UpdateJadwalDto) {
    await this.findOne(id);
    return this.prisma.jadwal.update({
      where: { id },
      data: {
        ...dto,
        tanggal_berangkat: dto.tanggal_berangkat
          ? new Date(dto.tanggal_berangkat)
          : undefined,
        tanggal_kedatangan: dto.tanggal_kedatangan
          ? new Date(dto.tanggal_kedatangan)
          : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.jadwal.delete({ where: { id } });
    return { message: 'Jadwal berhasil dihapus' };
  }
}
