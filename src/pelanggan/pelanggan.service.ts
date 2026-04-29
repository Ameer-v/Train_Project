import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePelangganDto } from './dto/create-pelanggan.dto';
import { UpdatePelangganDto } from './dto/update-pelanggan.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PelangganService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePelangganDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.users.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        role: 'penumpang',
        pelanggan: {
          create: {
            NIK: dto.NIK,
            nama_penumpang: dto.nama_penumpang,
            alamat: dto.alamat,
            telp: dto.telp,
          },
        },
      },
      include: { pelanggan: true },
    });
  }

  findAll() {
    return this.prisma.pelanggan.findMany({ include: { user: true } });
  }

  async findOne(id: number) {
    const data = await this.prisma.pelanggan.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!data) throw new NotFoundException('Pelanggan tidak ditemukan');
    return data;
  }

  async update(id: number, dto: UpdatePelangganDto) {
    await this.findOne(id);
    return this.prisma.pelanggan.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    // findOne sudah throw NotFoundException jika tidak ada, jadi pelanggan pasti ada
    const pelanggan = await this.findOne(id);
    await this.prisma.pelanggan.delete({ where: { id } });
    await this.prisma.users.delete({ where: { id: pelanggan.id_user } });
    return { message: 'Pelanggan berhasil dihapus' };
  }
}
