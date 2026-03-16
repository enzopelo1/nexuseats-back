import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('restaurants v1 (DEPRECATED)')
@Controller({ path: 'restaurants', version: '1' })
export class RestaurantsV1Controller {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Créer un nouveau restaurant',
    description: 'DEPRECATED: Utilisez /v2/restaurants - Crée un nouveau restaurant dans la base de données avec toutes les informations nécessaires',
    deprecated: true,
  })
  @ApiBody({
    type: CreateRestaurantDto,
    description: 'Données du restaurant à créer',
  })
  @ApiResponse({
    status: 201,
    description: 'Le restaurant a été créé avec succès',
    type: Restaurant,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides - vérifiez les champs requis et leurs formats',
    schema: {
      example: {
        statusCode: 400,
        message: ['name should not be empty', 'averagePrice must be a number'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Un restaurant avec ce nom et cette adresse existe déjà',
    schema: {
      example: {
        statusCode: 409,
        message: 'Un restaurant avec ce nom et cette adresse existe déjà',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Rôle insuffisant (owner ou admin requis)' })
  create(
    @Body(ValidationPipe) createRestaurantDto: CreateRestaurantDto,
    @CurrentUser() user: { id: number; email: string; role: string },
  ): Restaurant {
    return this.restaurantsService.create(createRestaurantDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les restaurants',
    description: 'DEPRECATED: Utilisez /v2/restaurants - Retourne une liste paginée de tous les restaurants disponibles',
    deprecated: true,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de la page (commence à 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Nombre de restaurants par page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des restaurants récupérée avec succès',
    schema: {
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Le Petit Bistrot',
            address: '15 Rue de la Paix, 75002 Paris',
            phone: '+33 1 42 86 82 82',
            cuisineType: 'french',
            rating: 4.5,
            averagePrice: 25.5,
            deliveryTime: 30,
            isOpen: true,
            description: 'Restaurant traditionnel français',
            imageUrl: 'https://example.com/images/restaurant.jpg',
            specialties: ['Coq au vin', 'Boeuf bourguignon'],
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-02-20T14:45:00Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      },
    },
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.restaurantsService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un restaurant par son ID',
    description: 'DEPRECATED: Utilisez /v2/restaurants/:id - Retourne les détails complets d\'un restaurant spécifique',
    deprecated: true,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifiant unique du restaurant (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant trouvé avec succès',
    type: Restaurant,
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant non trouvé',
    schema: {
      example: {
        statusCode: 404,
        message: 'Restaurant avec l\'ID 550e8400-e29b-41d4-a716-446655440000 non trouvé',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id') id: string): Restaurant {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Mettre à jour un restaurant',
    description: 'DEPRECATED: Utilisez /v2/restaurants/:id - Met à jour partiellement ou totalement les informations d\'un restaurant existant',
    deprecated: true,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifiant unique du restaurant (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateRestaurantDto,
    description: 'Données du restaurant à mettre à jour (tous les champs sont optionnels)',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant mis à jour avec succès',
    type: Restaurant,
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant non trouvé',
    schema: {
      example: {
        statusCode: 404,
        message: 'Restaurant avec l\'ID 550e8400-e29b-41d4-a716-446655440000 non trouvé',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
    schema: {
      example: {
        statusCode: 400,
        message: ['rating must not be greater than 5'],
        error: 'Bad Request',
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateRestaurantDto: UpdateRestaurantDto,
  ): Restaurant {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Supprimer un restaurant',
    description: 'DEPRECATED: Utilisez /v2/restaurants/:id - Supprime définitivement un restaurant de la base de données',
    deprecated: true,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifiant unique du restaurant (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Restaurant supprimé avec succès (pas de contenu retourné)',
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant non trouvé',
    schema: {
      example: {
        statusCode: 404,
        message: 'Restaurant avec l\'ID 550e8400-e29b-41d4-a716-446655440000 non trouvé',
        error: 'Not Found',
      },
    },
  })
  remove(@Param('id') id: string): void {
    return this.restaurantsService.remove(id);
  }
}
