import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePetugasDto {
  @IsString() @IsNotEmpty() username: string;
  @IsString() @IsNotEmpty() password: string;
  @IsString() @IsNotEmpty() nama_petugas: string;
  @IsString() @IsNotEmpty() alamat: string;
  @IsString() @IsNotEmpty() telp: string;
}
