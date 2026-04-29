import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Hanya admin yang bisa lihat semua user
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  // Admin bisa lihat user manapun, pelanggan hanya bisa lihat dirinya sendiri
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    const targetId = +id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin' && req.user.userId !== targetId) {
      return { message: 'Akses ditolak' };
    }
    return this.usersService.findOne(targetId);
  }

  // User bisa update akunnya sendiri, admin bisa update siapapun
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Request() req) {
    const targetId = +id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin' && req.user.userId !== targetId) {
      return { message: 'Akses ditolak' };
    }
    return this.usersService.update(targetId, dto);
  }

  // Hanya admin yang bisa hapus user
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
