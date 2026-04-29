import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePembelianTiketDto } from './dto/create-pembelian-tiket.dto';

@Injectable()
export class PembelianTiketService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePembelianTiketDto, userId: number) {
    // Cari pelanggan berdasarkan userId
    const pelanggan = await this.prisma.pelanggan.findFirst({
      where: { id_user: userId },
    });
    if (!pelanggan)
      throw new NotFoundException('Data pelanggan tidak ditemukan');

    // Validasi jadwal ada
    const jadwal = await this.prisma.jadwal.findUnique({
      where: { id: dto.id_jadwal },
    });
    if (!jadwal) throw new NotFoundException('Jadwal tidak ditemukan');

    // Validasi kursi tersedia & belum dipesan
    for (const detail of dto.detail_penumpang) {
      const kursi = await this.prisma.kursi.findUnique({
        where: { id: detail.id_kursi },
      });
      if (!kursi)
        throw new NotFoundException(
          `Kursi id ${detail.id_kursi} tidak ditemukan`,
        );

      const sudahDipesan = await this.prisma.detail_pembelian.findFirst({
        where: {
          id_kursi: detail.id_kursi,
          pembelian_tiket: { id_jadwal: dto.id_jadwal },
        },
      });
      if (sudahDipesan) {
        throw new BadRequestException(`Kursi ${kursi.no_kursi} sudah dipesan`);
      }
    }

    // Validasi kuota gerbong
    // Kelompokkan penumpang berdasarkan gerbong
    const kursiIds = dto.detail_penumpang.map((d) => d.id_kursi);
    const kursiList = await this.prisma.kursi.findMany({
      where: { id: { in: kursiIds } },
      include: { gerbong: true },
    });

    const gerbongMap = new Map<number, { kuota: number; nama: string }>();
    for (const k of kursiList) {
      if (!gerbongMap.has(k.id_gerbong)) {
        gerbongMap.set(k.id_gerbong, {
          kuota: k.gerbong.kuota,
          nama: k.gerbong.nama_gerbong,
        });
      }
    }

    for (const [id_gerbong, info] of gerbongMap) {
      // Hitung kursi yang sudah dipesan di gerbong ini untuk jadwal ini
      const sudahDipesanCount = await this.prisma.detail_pembelian.count({
        where: {
          kursi: { id_gerbong },
          pembelian_tiket: { id_jadwal: dto.id_jadwal },
        },
      });

      // Hitung berapa kursi baru yang dipesan di gerbong ini
      const pesanBaru = kursiList.filter(
        (k) => k.id_gerbong === id_gerbong,
      ).length;

      if (sudahDipesanCount + pesanBaru > info.kuota) {
        throw new BadRequestException(
          `Kuota gerbong ${info.nama} sudah penuh (kapasitas: ${info.kuota}, terisi: ${sudahDipesanCount}, dipesan: ${pesanBaru})`,
        );
      }
    }

    // Buat transaksi
    return this.prisma.pembelian_tiket.create({
      data: {
        tanggal_pembelian: new Date(),
        id_pelanggan: pelanggan.id,
        id_jadwal: dto.id_jadwal,
        detail_pembelian: {
          create: dto.detail_penumpang.map((d) => ({
            NIK: d.NIK,
            nama_penumpang: d.nama_penumpang,
            id_kursi: d.id_kursi,
          })),
        },
      },
      include: { detail_pembelian: true, jadwal: true },
    });
  }

  // Histori pemesanan pelanggan (per tanggal / bulan)
  async findByPelanggan(
    userId: number,
    tanggal?: string,
    bulan?: string,
    tahun?: string,
  ) {
    const pelanggan = await this.prisma.pelanggan.findFirst({
      where: { id_user: userId },
    });
    if (!pelanggan)
      throw new NotFoundException('Data pelanggan tidak ditemukan');

    let whereDate: any = {};
    if (tanggal && bulan && tahun) {
      const start = new Date(`${tahun}-${bulan}-${tanggal}`);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      whereDate = { tanggal_pembelian: { gte: start, lt: end } };
    } else if (bulan && tahun) {
      const start = new Date(`${tahun}-${bulan}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      whereDate = { tanggal_pembelian: { gte: start, lt: end } };
    }

    return this.prisma.pembelian_tiket.findMany({
      where: { id_pelanggan: pelanggan.id, ...whereDate },
      include: {
        jadwal: { include: { kereta: true } },
        detail_pembelian: { include: { kursi: true } },
      },
    });
  }

  // Histori semua transaksi untuk petugas
  async findAll(tanggal?: string, bulan?: string, tahun?: string) {
    let whereDate: any = {};
    if (tanggal && bulan && tahun) {
      const start = new Date(`${tahun}-${bulan}-${tanggal}`);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      whereDate = { tanggal_pembelian: { gte: start, lt: end } };
    } else if (bulan && tahun) {
      const start = new Date(`${tahun}-${bulan}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      whereDate = { tanggal_pembelian: { gte: start, lt: end } };
    }

    return this.prisma.pembelian_tiket.findMany({
      where: whereDate,
      include: {
        pelanggan: true,
        jadwal: { include: { kereta: true } },
        detail_pembelian: { include: { kursi: true } },
      },
    });
  }

  // Rekap pemasukan perbulan untuk petugas
  async rekapPerBulan(tahun: string) {
    const data = await this.prisma.pembelian_tiket.findMany({
      where: {
        tanggal_pembelian: {
          gte: new Date(`${tahun}-01-01`),
          lt: new Date(`${parseInt(tahun) + 1}-01-01`),
        },
      },
      include: { jadwal: true },
    });

    const rekap: Record<
      number,
      { jumlah_transaksi: number; total_pemasukan: number }
    > = {};
    for (let m = 1; m <= 12; m++) {
      rekap[m] = { jumlah_transaksi: 0, total_pemasukan: 0 };
    }

    for (const item of data) {
      const bulan = new Date(item.tanggal_pembelian).getMonth() + 1;
      rekap[bulan].jumlah_transaksi += 1;
      rekap[bulan].total_pemasukan += item.jadwal.harga;
    }

    return rekap;
  }

  async findOne(id: number) {
    const data = await this.prisma.pembelian_tiket.findUnique({
      where: { id },
      include: {
        pelanggan: true,
        jadwal: { include: { kereta: true } },
        detail_pembelian: {
          include: { kursi: { include: { gerbong: true } } },
        },
      },
    });
    if (!data) throw new NotFoundException('Data pembelian tidak ditemukan');
    return data;
  }
}
