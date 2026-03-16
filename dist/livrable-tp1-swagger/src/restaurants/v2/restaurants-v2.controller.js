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
exports.RestaurantsV2Controller = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const restaurants_v2_service_1 = require("./restaurants-v2.service");
const create_restaurant_v2_dto_1 = require("./dto/create-restaurant-v2.dto");
const update_restaurant_v2_dto_1 = require("./dto/update-restaurant-v2.dto");
const restaurant_v2_entity_1 = require("./entities/restaurant-v2.entity");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const roles_guard_1 = require("../../auth/roles.guard");
const roles_decorator_1 = require("../../auth/roles.decorator");
const current_user_decorator_1 = require("../../auth/current-user.decorator");
let RestaurantsV2Controller = class RestaurantsV2Controller {
    constructor(restaurantsService) {
        this.restaurantsService = restaurantsService;
    }
    async create(createRestaurantDto, user) {
        return await this.restaurantsService.create(createRestaurantDto, user.id);
    }
    findAll(page, limit, cuisine, minRating, maxRating, isOpen, search, fields) {
        const filters = {};
        if (cuisine)
            filters.cuisine = cuisine;
        if (minRating !== undefined)
            filters.minRating = Number(minRating);
        if (maxRating !== undefined)
            filters.maxRating = Number(maxRating);
        if (isOpen !== undefined)
            filters.isOpen = isOpen === 'true';
        if (search)
            filters.search = search;
        const allowedFields = [
            'id',
            'name',
            'cuisine',
            'address',
            'countryCode',
            'localNumber',
            'rating',
            'averagePrice',
            'deliveryTime',
            'isOpen',
            'description',
            'imageUrl',
            'createdAt',
            'updatedAt',
        ];
        let select;
        if (fields) {
            const requested = fields
                .split(',')
                .map((f) => f.trim())
                .filter(Boolean);
            const valid = requested.filter((f) => allowedFields.includes(f));
            if (valid.length > 0) {
                select = {};
                for (const field of valid) {
                    select[field] = true;
                }
            }
        }
        return this.restaurantsService.findAll(page ? Number(page) : 1, limit ? Number(limit) : 10, filters, select);
    }
    async scroll(cursor, limit) {
        return await this.restaurantsService.scroll(limit ? Number(limit) : 20, cursor);
    }
    async findOne(id) {
        return await this.restaurantsService.findOne(id);
    }
    async update(id, updateRestaurantDto) {
        return await this.restaurantsService.update(id, updateRestaurantDto);
    }
    async remove(id) {
        return await this.restaurantsService.remove(id);
    }
};
exports.RestaurantsV2Controller = RestaurantsV2Controller;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner', 'admin'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer un nouveau restaurant',
        description: 'Crée un nouveau restaurant dans la base de données avec les nouveaux champs countryCode et localNumber (séparation du numéro de téléphone)',
    }),
    (0, swagger_1.ApiBody)({
        type: create_restaurant_v2_dto_1.CreateRestaurantV2Dto,
        description: 'Données du restaurant à créer (v2 avec countryCode et localNumber)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Le restaurant a été créé avec succès',
        type: restaurant_v2_entity_1.RestaurantV2,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Données invalides - vérifiez les champs requis et leurs formats',
        schema: {
            example: {
                statusCode: 400,
                message: ['name should not be empty', 'countryCode should not be empty', 'localNumber should not be empty'],
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
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Non authentifié',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Rôle insuffisant (owner ou admin requis)',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_restaurant_v2_dto_1.CreateRestaurantV2Dto, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsV2Controller.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les restaurants',
        description: 'Retourne une liste paginée de tous les restaurants disponibles avec filtres (v2 avec countryCode et localNumber)',
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
    (0, swagger_1.ApiQuery)({
        name: 'cuisine',
        required: false,
        enum: ['FRENCH', 'ITALIAN', 'JAPANESE', 'CHINESE', 'INDIAN', 'MEXICAN', 'AMERICAN', 'MEDITERRANEAN', 'THAI', 'OTHER'],
        description: 'Filtrer par type de cuisine',
        example: 'ITALIAN',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minRating',
        required: false,
        type: Number,
        description: 'Note minimale (0-5)',
        example: 4,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'maxRating',
        required: false,
        type: Number,
        description: 'Note maximale (0-5)',
        example: 5,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isOpen',
        required: false,
        type: Boolean,
        description: 'Filtrer par statut ouvert/fermé',
        example: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: String,
        description: 'Recherche dans le nom et la description',
        example: 'pizza',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'fields',
        required: false,
        type: String,
        description: 'Liste des champs à retourner (ex: id,name,cuisine,rating)',
        example: 'id,name,cuisine,rating',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('cuisine')),
    __param(3, (0, common_1.Query)('minRating')),
    __param(4, (0, common_1.Query)('maxRating')),
    __param(5, (0, common_1.Query)('isOpen')),
    __param(6, (0, common_1.Query)('search')),
    __param(7, (0, common_1.Query)('fields')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number, Number, String, String, String]),
    __metadata("design:returntype", void 0)
], RestaurantsV2Controller.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('scroll'),
    (0, swagger_1.ApiOperation)({
        summary: 'Parcourir les restaurants avec pagination cursor',
        description: 'Retourne une liste de restaurants à partir d\'un curseur, avec nextCursor pour charger la suite.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'cursor',
        required: false,
        type: String,
        description: 'Identifiant du dernier restaurant reçu (cursor)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre de restaurants à retourner (max 100)',
        example: 20,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des restaurants pour cette page cursor',
        schema: {
            example: {
                data: [
                    {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        name: 'Chez Marco',
                    },
                ],
                meta: {
                    nextCursor: '550e8400-e29b-41d4-a716-446655440000',
                    hasNext: true,
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('cursor')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], RestaurantsV2Controller.prototype, "scroll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer un restaurant par son ID',
        description: 'Retourne les détails complets d\'un restaurant spécifique (v2 avec countryCode et localNumber)',
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
        type: restaurant_v2_entity_1.RestaurantV2,
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
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsV2Controller.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner', 'admin'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mettre à jour un restaurant',
        description: 'Met à jour partiellement ou totalement les informations d\'un restaurant existant (v2 avec countryCode et localNumber)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'Identifiant unique du restaurant (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({
        type: update_restaurant_v2_dto_1.UpdateRestaurantV2Dto,
        description: 'Données du restaurant à mettre à jour (tous les champs sont optionnels)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Restaurant mis à jour avec succès',
        type: restaurant_v2_entity_1.RestaurantV2,
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
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_restaurant_v2_dto_1.UpdateRestaurantV2Dto]),
    __metadata("design:returntype", Promise)
], RestaurantsV2Controller.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({
        summary: 'Supprimer un restaurant',
        description: 'Supprime définitivement un restaurant de la base de données',
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
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsV2Controller.prototype, "remove", null);
exports.RestaurantsV2Controller = RestaurantsV2Controller = __decorate([
    (0, swagger_1.ApiTags)('restaurants v2'),
    (0, common_1.Controller)({ path: 'restaurants', version: '2' }),
    __metadata("design:paramtypes", [restaurants_v2_service_1.RestaurantsV2Service])
], RestaurantsV2Controller);
//# sourceMappingURL=restaurants-v2.controller.js.map