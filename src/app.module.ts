import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PelangganModule } from './pelanggan/pelanggan.module';
import { PetugasModule } from './petugas/petugas.module';
import { KeretaModule } from './kereta/kereta.module';
import { GerbongModule } from './gerbong/gerbong.module';
import { KursiModule } from './kursi/kursi.module';
import { JadwalModule } from './jadwal/jadwal.module';
import { PembelianTiketModule } from './pembelian-tiket/pembelian-tiket.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PelangganModule,
    PetugasModule,
    KeretaModule,
    GerbongModule,
    KursiModule,
    JadwalModule,
    PembelianTiketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
