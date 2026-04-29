import { IsInt, IsArray, ValidateNested, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class DetailPenumpangDto {
  @IsString() @IsNotEmpty() NIK: string;
  @IsString() @IsNotEmpty() nama_penumpang: string;
  @IsInt() id_kursi: number;
}

export class CreatePembelianTiketDto {
  @IsInt()
  id_jadwal: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailPenumpangDto)
  detail_penumpang: DetailPenumpangDto[];
}
