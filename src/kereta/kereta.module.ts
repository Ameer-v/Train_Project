import { Module } from '@nestjs/common';
import { KeretaService } from './kereta.service';
import { KeretaController } from './kereta.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KeretaController],
  providers: [KeretaService],
})
export class KeretaModule {}
