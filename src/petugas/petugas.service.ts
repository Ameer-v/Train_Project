import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetugasDto } from './dto/create-petugas.dto';
import { UpdatePetugasDto } from './dto/update-petugas.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PetugasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePetugasDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.users.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        role: 'admin',
        petugas: {
          create: {
            nama_petugas: dto.nama_petugas,
            alamat: dto.alamat,
            telp: dto.telp,
          },
        },
      },
      include: { petugas: true },
    });
  }

  findAll() {
    return this.prisma.petugas.findMany({ include: { user: true } });
  }

  async findOne(id: number) {
    const data = await this.prisma.petugas.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!data) throw new NotFoundException('Petugas tidak ditemukan');
    return data;
  }

  async update(id: number, dto: UpdatePetugasDto) {
    await this.findOne(id);
    return this.prisma.petugas.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const petugas = await this.findOne(id);
    await this.prisma.petugas.delete({ where: { id } });
    await this.prisma.users.delete({ where: { id: petugas.id_user } });
    return { message: 'Petugas berhasil dihapus' };
  }
}
