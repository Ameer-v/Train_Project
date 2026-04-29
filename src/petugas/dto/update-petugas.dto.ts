import { IsString, IsOptional } from 'class-validator';

export class UpdatePetugasDto {
  @IsOptional() @IsString() nama_petugas?: string;
  @IsOptional() @IsString() alamat?: string;
  @IsOptional() @IsString() telp?: string;
}
