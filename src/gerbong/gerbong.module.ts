import { Module } from '@nestjs/common';
import { GerbongService } from './gerbong.service';
import { GerbongController } from './gerbong.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GerbongController],
  providers: [GerbongService],
})
export class GerbongModule {}
