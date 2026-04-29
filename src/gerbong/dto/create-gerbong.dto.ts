import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateGerbongDto {
  @IsString() @IsNotEmpty() nama_gerbong: string;
  @IsInt() kuota: number;
  @IsInt() id_kereta: number;
}
