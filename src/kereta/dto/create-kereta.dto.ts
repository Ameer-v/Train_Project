import { IsString, IsNotEmpty } from 'class-validator';

export class CreateKeretaDto {
  @IsString() @IsNotEmpty() nama_kereta: string;
  @IsString() @IsNotEmpty() deskripsi: string;
  @IsString() @IsNotEmpty() kelas: string;
}
