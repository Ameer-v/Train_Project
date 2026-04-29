import { IsString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';

export class CreateJadwalDto {
  @IsString() @IsNotEmpty() asal_keberangkatan: string;
  @IsString() @IsNotEmpty() tujuan_keberangkatan: string;
  @IsString() @IsNotEmpty() tanggal_berangkat: string;
  @IsString() @IsNotEmpty() tanggal_kedatangan: string;
  @IsNumber() harga: number;
  @IsInt() id_kereta: number;
}
