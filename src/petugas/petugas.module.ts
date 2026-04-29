import { Module } from '@nestjs/common';
import { PetugasService } from './petugas.service';
import { PetugasController } from './petugas.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PetugasController],
  providers: [PetugasService],
})
export class PetugasModule {}
