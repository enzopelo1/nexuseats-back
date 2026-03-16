import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@ApiTags('menus')
@Controller()
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post('menus')
  @ApiOperation({
    summary: 'Créer un nouveau menu',
    description: 'Crée un nouveau menu pour un restaurant',
  })
  @ApiBody({
    type: CreateMenuDto,
    description: 'Données du menu à créer',
  })
  @ApiResponse({
    status: 201,
    description: 'Le menu a été créé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant non trouvé',
  })
  async create(@Body(ValidationPipe) createMenuDto: CreateMenuDto) {
    return await this.menusService.create(createMenuDto);
  }

  @Get('restaurants/:restaurantId/menus')
  @ApiOperation({
    summary: 'Récupérer tous les menus d\'un restaurant',
    description: 'Retourne la liste des menus avec leurs items',
  })
  @ApiParam({
    name: 'restaurantId',
    type: String,
    description: 'ID du restaurant',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des menus récupérée avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant non trouvé',
  })
  async findAllByRestaurant(@Param('restaurantId') restaurantId: string) {
    return await this.menusService.findAllByRestaurant(restaurantId);
  }

  @Get('menus/:id')
  @ApiOperation({
    summary: 'Récupérer un menu par son ID',
    description: 'Retourne les détails d\'un menu avec ses items et catégories',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID du menu',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu trouvé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu non trouvé',
  })
  async findOne(@Param('id') id: string) {
    return await this.menusService.findOne(id);
  }

  @Patch('menus/:id')
  @ApiOperation({
    summary: 'Mettre à jour un menu',
    description: 'Met à jour les informations d\'un menu',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID du menu',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateMenuDto,
    description: 'Données du menu à mettre à jour',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu mis à jour avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu non trouvé',
  })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateMenuDto: UpdateMenuDto,
  ) {
    return await this.menusService.update(id, updateMenuDto);
  }

  @Delete('menus/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un menu',
    description: 'Supprime un menu et tous ses items (cascade)',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID du menu',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Menu supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu non trouvé',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.menusService.remove(id);
  }
}
