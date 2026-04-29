import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGerbongDto } from './dto/create-gerbong.dto';
import { UpdateGerbongDto } from './dto/update-gerbong.dto';

@Injectable()
export class GerbongService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateGerbongDto) {
    return this.prisma.gerbong.create({ data: dto });
  }

  findAll() {
    return this.prisma.gerbong.findMany({ include: { kereta: true, kursi: true } });
  }

  async findOne(id: number) {
    const data = await this.prisma.gerbong.findUnique({
      where: { id },
      include: { kereta: true, kursi: true },
    });
    if (!data) throw new NotFoundException('Gerbong tidak ditemukan');
    return data;
  }

  async update(id: number, dto: UpdateGerbongDto) {
    await this.findOne(id);
    return this.prisma.gerbong.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.gerbong.delete({ where: { id } });
    return { message: 'Gerbong berhasil dihapus' };
  }
}
