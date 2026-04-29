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
import { PetugasService } from './petugas.service';
import { CreatePetugasDto } from './dto/create-petugas.dto';
import { UpdatePetugasDto } from './dto/update-petugas.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Petugas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('petugas')
export class PetugasController {
  constructor(private petugasService: PetugasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new petugas' })
  create(@Body() dto: CreatePetugasDto) {
    return this.petugasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all petugas' })
  findAll() {
    return this.petugasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a petugas by ID' })
  findOne(@Param('id') id: string) {
    return this.petugasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a petugas by ID' })
  update(@Param('id') id: string, @Body() dto: UpdatePetugasDto) {
    return this.petugasService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a petugas by ID' })
  remove(@Param('id') id: string) {
    return this.petugasService.remove(+id);
  }
}
