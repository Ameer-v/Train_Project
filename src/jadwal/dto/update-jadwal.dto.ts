import { IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

export class UpdateJadwalDto {
  @IsOptional() @IsString() asal_keberangkatan?: string;
  @IsOptional() @IsString() tujuan_keberangkatan?: string;
  @IsOptional() @IsString() tanggal_berangkat?: string;
  @IsOptional() @IsString() tanggal_kedatangan?: string;
  @IsOptional() @IsNumber() harga?: number;
  @IsOptional() @IsInt() id_kereta?: number;
}
