import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.users.create({
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
    return { message: 'Registrasi berhasil', user };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.users.findFirst({
      where: { username: dto.username },
    });
    if (!user) throw new UnauthorizedException('Username atau password salah');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Username atau password salah');

    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}
