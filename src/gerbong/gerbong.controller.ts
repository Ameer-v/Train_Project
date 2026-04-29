import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { GerbongService } from './gerbong.service';
import { CreateGerbongDto } from './dto/create-gerbong.dto';
import { UpdateGerbongDto } from './dto/update-gerbong.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Gerbong')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('gerbong')
export class GerbongController {
  constructor(private gerbongService: GerbongService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gerbong' })
  create(@Body() dto: CreateGerbongDto) {
    return this.gerbongService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gerbongs' })
  findAll() {
    return this.gerbongService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a gerbong by ID' })
  findOne(@Param('id') id: string) {
    return this.gerbongService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a gerbong by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateGerbongDto) {
    return this.gerbongService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a gerbong by ID' })
  remove(@Param('id') id: string) {
    return this.gerbongService.remove(+id);
  }
}
