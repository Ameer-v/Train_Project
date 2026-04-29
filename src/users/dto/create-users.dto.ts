import { IsString, IsNotEmpty, IsEnum, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsEnum(['admin', 'penumpang'])
  role: 'admin' | 'penumpang';
}
