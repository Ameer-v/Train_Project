import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateKursiDto {
  @IsString() @IsNotEmpty() no_kursi: string;
  @IsInt() id_gerbong: number;
}
