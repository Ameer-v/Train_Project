import { IsString, IsOptional } from 'class-validator';

export class UpdateKeretaDto {
  @IsOptional() @IsString() nama_kereta?: string;
  @IsOptional() @IsString() deskripsi?: string;
  @IsOptional() @IsString() kelas?: string;
}
