import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        pelanggan: true,
        petugas: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        pelanggan: true,
        petugas: true,
      },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  async findByUsername(username: string) {
    return this.prisma.users.findFirst({ where: { username } });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.password) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      data.password = await bcrypt.hash(dto.password, 10);
    }
    return this.prisma.users.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      select: { id: true, username: true, role: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.users.delete({ where: { id } });
    return { message: 'User berhasil dihapus' };
  }
}
