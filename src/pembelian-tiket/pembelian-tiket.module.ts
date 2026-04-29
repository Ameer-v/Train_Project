import { Module } from '@nestjs/common';
import { PembelianTiketService } from './pembelian-tiket.service';
import { PembelianTiketController } from './pembelian-tiket.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PembelianTiketController],
  providers: [PembelianTiketService],
})
export class PembelianTiketModule {}
