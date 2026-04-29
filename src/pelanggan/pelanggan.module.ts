import { Module } from '@nestjs/common';
import { PelangganService } from './pelanggan.service';
import { PelangganController } from './pelanggan.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PelangganController],
  providers: [PelangganService],
})
export class PelangganModule {}
