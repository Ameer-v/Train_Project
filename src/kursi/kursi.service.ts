import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKursiDto } from './dto/create-kursi.dto';
import { UpdateKursiDto } from './dto/update-kursi.dto';

@Injectable()
export class KursiService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateKursiDto) {
    return this.prisma.kursi.create({ data: dto });
  }

  findAll() {
    return this.prisma.kursi.findMany({ include: { gerbong: true } });
  }

  async findOne(id: number) {
    const data = await this.prisma.kursi.findUnique({
      where: { id },
      include: { gerbong: true },
    });
    if (!data) throw new NotFoundException('Kursi tidak ditemukan');
    return data;
  }

  async findTersediaByJadwal(id_jadwal: number) {
    // Cari semua id_kursi yang sudah dipesan pada jadwal ini
    const sudahDipesan = await this.prisma.detail_pembelian.findMany({
      where: {
        pembelian_tiket: { id_jadwal },
      },
      select: { id_kursi: true },
    });

    const idKursiDipesan = sudahDipesan.map((d) => d.id_kursi);

    // Ambil semua kursi yang id-nya TIDAK ada di daftar yang sudah dipesan
    return this.prisma.kursi.findMany({
      where: {
        id: { notIn: idKursiDipesan.length > 0 ? idKursiDipesan : [-1] },
      },
      include: {
        gerbong: {
          include: { kereta: true },
        },
      },
    });
  }

  async findTersediaByJadwalDanGerbong(id_jadwal: number, id_gerbong: number) {
    const sudahDipesan = await this.prisma.detail_pembelian.findMany({
      where: {
        pembelian_tiket: { id_jadwal },
      },
      select: { id_kursi: true },
    });

    const idKursiDipesan = sudahDipesan.map((d) => d.id_kursi);

    return this.prisma.kursi.findMany({
      where: {
        id_gerbong,
        id: { notIn: idKursiDipesan.length > 0 ? idKursiDipesan : [-1] },
      },
      include: { gerbong: true },
    });
  }

  async findDipesanByJadwal(id_jadwal: number) {
    const sudahDipesan = await this.prisma.detail_pembelian.findMany({
      where: {
        pembelian_tiket: { id_jadwal },
      },
      select: { id_kursi: true },
    });

    const idKursiDipesan = sudahDipesan.map((d) => d.id_kursi);

    return this.prisma.kursi.findMany({
      where: {
        id: { in: idKursiDipesan.length > 0 ? idKursiDipesan : [-1] },
      },
      include: { gerbong: true },
    });
  }

  async update(id: number, dto: UpdateKursiDto) {
    await this.findOne(id);
    return this.prisma.kursi.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.kursi.delete({ where: { id } });
    return { message: 'Kursi berhasil dihapus' };
  }
}
