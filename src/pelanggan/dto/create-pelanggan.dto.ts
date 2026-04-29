import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePelangganDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  NIK: string;

  @IsString()
  @IsNotEmpty()
  nama_penumpang: string;

  @IsString()
  @IsNotEmpty()
  alamat: string;

  @IsString()
  @IsNotEmpty()
  telp: string;
}
