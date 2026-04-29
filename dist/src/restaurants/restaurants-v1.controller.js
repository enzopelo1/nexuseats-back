"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantsV1Controller = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const restaurants_service_1 = require("./restaurants.service");
const create_restaurant_dto_1 = require("./dto/create-restaurant.dto");
const update_restaurant_dto_1 = require("./dto/update-restaurant.dto");
const restaurant_entity_1 = require("./entities/restaurant.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let RestaurantsV1Controller = class RestaurantsV1Controller {
    constructor(restaurantsService) {
        this.restaurantsService = restaurantsService;
    }
    create(createRestaurantDto, user) {
        return this.restaurantsService.create(createRestaurantDto, user.id);
    }
    findAll(page, limit) {
        return this.restaurantsService.findAll(page ? Number(page) : 1, limit ? Number(limit) : 10);
    }
    findOne(id) {
        return this.restaurantsService.findOne(id);
    }
    update(id, updateRestaurantDto) {
        return this.restaurantsService.update(id, updateRestaurantDto);
    }
    remove(id) {
        return this.restaurantsService.remove(id);
    }
};
exports.RestaurantsV1Controller = RestaurantsV1Controller;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner', 'admin'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer un nouveau restaurant',
        description: 'DEPRECATED: Utilisez /v2/restaurants - Crée un nouveau restaurant dans la base de données avec toutes les informations nécessaires',
        deprecated: true,
    }),
    (0, swagger_1.ApiBody)({
        type: create_restaurant_dto_1.CreateRestaurantDto,
        description: 'Données du restaurant à créer',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Le restaurant a été créé avec succès',
        type: restaurant_entity_1.Restaurant,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Données invalides - vérifiez les champs requis et leurs formats',
        schema: {
            example: {
                statusCode: 400,
                message: ['name should not be empty', 'averagePrice must be a number'],
                error: 'Bad Request',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Un restaurant avec ce nom et cette adresse existe déjà',
        schema: {
            example: {
                statusCode: 409,
                message: 'Un restaurant avec ce nom et cette adresse existe déjà',
                error: 'Conflict',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non authentifié' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Rôle insuffisant (owner ou admin requis)' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_restaurant_dto_1.CreateRestaurantDto, Object]),
    __metadata("design:returntype", restaurant_entity_1.Restaurant)
], RestaurantsV1Controller.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les restaurants',
        description: 'DEPRECATED: Utilisez /v2/restaurants - Retourne une liste paginée de tous les restaurants disponibles',
        deprecated: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Numéro de la page (commence à 1)',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre de restaurants par page',
        example: 10,
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], RestaurantsV1Controller.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer un restaurant par son ID',
        description: 'DEPRECATED: Utilisez /v2/restaurants/:id - Retourne les détails complets d\'un restaurant spécifique',
        deprecated: true,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'Identifiant unique du restaurant (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Restaurant trouvé avec succès',
        type: restaurant_entity_1.Restaurant,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Restaurant non trouvé',
        schema: {
            example: {
                statusCode: 404,
                message: 'Restaurant avec l\'ID 550e8400-e29b-41d4-a716-446655440000 non trouvé',
                error: 'Not Found',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", restaurant_entity_1.Restaurant)
], RestaurantsV1Controller.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner', 'admin'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mettre à jour un restaurant',
        description: 'DEPRECATED: Utilisez /v2/restaurants/:id - Met à jour partiellement ou totalement les informations d\'un restaurant existant',
        deprecated: true,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'Identifiant unique du restaurant (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({
        type: update_restaurant_dto_1.UpdateRestaurantDto,
        description: 'Données du restaurant à mettre à jour (tous les champs sont optionnels)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Restaurant mis à jour avec succès',
        type: restaurant_entity_1.Restaurant,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Restaurant non trouvé',
        schema: {
            example: {
                statusCode: 404,
                message: 'Restaurant avec l\'ID 550e8400-e29b-41d4-a716-446655440000 non trouvé',
                error: 'Not Found',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Données invalides',
        schema: {
            example: {
                statusCode: 400,
                message: ['rating must not be greater than 5'],
                error: 'Bad Request',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_restaurant_dto_1.UpdateRestaurantDto]),
    __metadata("design:returntype", restaurant_entity_1.Restaurant)
], RestaurantsV1Controller.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({
        summary: 'Supprimer un restaurant',
        description: 'DEPRECATED: Utilisez /v2/restaurants/:id - Supprime définitivement un restaurant de la base de données',
        deprecated: true,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'Identifiant unique du restaurant (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Restaurant supprimé avec succès (pas de contenu retourné)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Restaurant non trouvé',
        schema: {
            example: {
                statusCode: 404,
                message: 'Restaurant avec l\'ID 550e8400-e29b-41d4-a716-446655440000 non trouvé',
                error: 'Not Found',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RestaurantsV1Controller.prototype, "remove", null);
exports.RestaurantsV1Controller = RestaurantsV1Controller = __decorate([
    (0, swagger_1.ApiTags)('restaurants v1 (DEPRECATED)'),
    (0, common_1.Controller)({ path: 'restaurants', version: '1' }),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService])
], RestaurantsV1Controller);
//# sourceMappingURL=restaurants-v1.controller.js.map