import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateKursiDto {
  @IsOptional() @IsString() no_kursi?: string;
  @IsOptional() @IsInt() id_gerbong?: number;
}
