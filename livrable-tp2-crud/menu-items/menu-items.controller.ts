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
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@ApiTags('menu-items')
@Controller()
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post('menu-items')
  @ApiOperation({
    summary: 'Créer un nouvel item de menu',
    description: 'Crée un nouvel item pour un menu avec ses catégories',
  })
  @ApiBody({
    type: CreateMenuItemDto,
    description: 'Données de l\'item à créer',
  })
  @ApiResponse({
    status: 201,
    description: 'L\'item a été créé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu ou catégories non trouvés',
  })
  async create(@Body(ValidationPipe) createMenuItemDto: CreateMenuItemDto) {
    return await this.menuItemsService.create(createMenuItemDto);
  }

  @Get('menus/:menuId/items')
  @ApiOperation({
    summary: 'Récupérer tous les items d\'un menu',
    description: 'Retourne la liste des items avec leurs catégories',
  })
  @ApiParam({
    name: 'menuId',
    type: String,
    description: 'ID du menu',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des items récupérée avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu non trouvé',
  })
  async findAllByMenu(@Param('menuId') menuId: string) {
    return await this.menuItemsService.findAllByMenu(menuId);
  }

  @Get('menu-items/:id')
  @ApiOperation({
    summary: 'Récupérer un item par son ID',
    description: 'Retourne les détails d\'un item avec son menu et ses catégories',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID de l\'item',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Item trouvé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Item non trouvé',
  })
  async findOne(@Param('id') id: string) {
    return await this.menuItemsService.findOne(id);
  }

  @Patch('menu-items/:id')
  @ApiOperation({
    summary: 'Mettre à jour un item',
    description: 'Met à jour les informations d\'un item et ses catégories (N:M)',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID de l\'item',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateMenuItemDto,
    description: 'Données de l\'item à mettre à jour',
  })
  @ApiResponse({
    status: 200,
    description: 'Item mis à jour avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Item ou catégories non trouvés',
  })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return await this.menuItemsService.update(id, updateMenuItemDto);
  }

  @Delete('menu-items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un item',
    description: 'Supprime un item de menu',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID de l\'item',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Item supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Item non trouvé',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.menuItemsService.remove(id);
  }
}
