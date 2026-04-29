import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateGerbongDto {
  @IsOptional() @IsString() nama_gerbong?: string;
  @IsOptional() @IsInt() kuota?: number;
  @IsOptional() @IsInt() id_kereta?: number;
}
