import { IsString, IsOptional } from 'class-validator';

export class UpdatePelangganDto {
  @IsOptional()
  @IsString()
  NIK?: string;

  @IsOptional()
  @IsString()
  nama_penumpang?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  telp?: string;
}
