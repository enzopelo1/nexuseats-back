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
import { RestaurantsV2Service } from './restaurants-v2.service';
import { CreateRestaurantV2Dto } from './dto/create-restaurant-v2.dto';
import { UpdateRestaurantV2Dto } from './dto/update-restaurant-v2.dto';
import { RestaurantV2 } from './entities/restaurant-v2.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CurrentUser } from '../../auth/current-user.decorator';

@ApiTags('restaurants v2')
@Controller({ path: 'restaurants', version: '2' })
export class RestaurantsV2Controller {
  constructor(private readonly restaurantsService: RestaurantsV2Service) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Créer un nouveau restaurant',
    description: 'Crée un nouveau restaurant dans la base de données avec les nouveaux champs countryCode et localNumber (séparation du numéro de téléphone)',
  })
  @ApiBody({
    type: CreateRestaurantV2Dto,
    description: 'Données du restaurant à créer (v2 avec countryCode et localNumber)',
  })
  @ApiResponse({
    status: 201,
    description: 'Le restaurant a été créé avec succès',
    type: RestaurantV2,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides - vérifiez les champs requis et leurs formats',
    schema: {
      example: {
        statusCode: 400,
        message: ['name should not be empty', 'countryCode should not be empty', 'localNumber should not be empty'],
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
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Rôle insuffisant (owner ou admin requis)',
  })
  async create(
    @Body(ValidationPipe) createRestaurantDto: CreateRestaurantV2Dto,
    @CurrentUser() user: { id: number; email: string; role: string },
  ) {
    return await this.restaurantsService.create(createRestaurantDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les restaurants',
    description: 'Retourne une liste paginée de tous les restaurants disponibles avec filtres (v2 avec countryCode et localNumber)',
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
  @ApiQuery({
    name: 'cuisine',
    required: false,
    enum: ['FRENCH', 'ITALIAN', 'JAPANESE', 'CHINESE', 'INDIAN', 'MEXICAN', 'AMERICAN', 'MEDITERRANEAN', 'THAI', 'OTHER'],
    description: 'Filtrer par type de cuisine',
    example: 'ITALIAN',
  })
  @ApiQuery({
    name: 'minRating',
    required: false,
    type: Number,
    description: 'Note minimale (0-5)',
    example: 4,
  })
  @ApiQuery({
    name: 'maxRating',
    required: false,
    type: Number,
    description: 'Note maximale (0-5)',
    example: 5,
  })
  @ApiQuery({
    name: 'isOpen',
    required: false,
    type: Boolean,
    description: 'Filtrer par statut ouvert/fermé',
    example: true,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Recherche dans le nom et la description',
    example: 'pizza',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des restaurants récupérée avec succès',
    schema: {
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Chez Marco',
            address: '15 Rue de la Paix, 75002 Paris',
            countryCode: '+33',
            localNumber: '612345678',
            cuisine: 'ITALIAN',
            rating: 4.5,
            averagePrice: 25.5,
            deliveryTime: 30,
            isOpen: true,
            description: 'Restaurant traditionnel français',
            imageUrl: 'https://example.com/images/restaurant.jpg',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-02-20T14:45:00Z',
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          lastPage: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
    },
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('cuisine') cuisine?: string,
    @Query('minRating') minRating?: number,
    @Query('maxRating') maxRating?: number,
    @Query('isOpen') isOpen?: string,
    @Query('search') search?: string,
  ) {
    const filters: any = {};
    
    if (cuisine) filters.cuisine = cuisine;
    if (minRating !== undefined) filters.minRating = Number(minRating);
    if (maxRating !== undefined) filters.maxRating = Number(maxRating);
    if (isOpen !== undefined) filters.isOpen = isOpen === 'true';
    if (search) filters.search = search;

    return this.restaurantsService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      filters,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un restaurant par son ID',
    description: 'Retourne les détails complets d\'un restaurant spécifique (v2 avec countryCode et localNumber)',
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
    type: RestaurantV2,
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
  async findOne(@Param('id') id: string) {
    return await this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Mettre à jour un restaurant',
    description: 'Met à jour partiellement ou totalement les informations d\'un restaurant existant (v2 avec countryCode et localNumber)',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifiant unique du restaurant (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateRestaurantV2Dto,
    description: 'Données du restaurant à mettre à jour (tous les champs sont optionnels)',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant mis à jour avec succès',
    type: RestaurantV2,
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
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateRestaurantDto: UpdateRestaurantV2Dto,
  ) {
    return await this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Supprimer un restaurant',
    description: 'Supprime définitivement un restaurant de la base de données',
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
  async remove(@Param('id') id: string): Promise<void> {
    return await this.restaurantsService.remove(id);
  }
}
