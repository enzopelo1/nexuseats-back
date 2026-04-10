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
exports.MenusController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const menus_service_1 = require("./menus.service");
const create_menu_dto_1 = require("./dto/create-menu.dto");
const update_menu_dto_1 = require("./dto/update-menu.dto");
let MenusController = class MenusController {
    constructor(menusService) {
        this.menusService = menusService;
    }
    async create(createMenuDto) {
        return await this.menusService.create(createMenuDto);
    }
    async findAllByRestaurant(restaurantId) {
        return await this.menusService.findAllByRestaurant(restaurantId);
    }
    async findOne(id) {
        return await this.menusService.findOne(id);
    }
    async update(id, updateMenuDto) {
        return await this.menusService.update(id, updateMenuDto);
    }
    async remove(id) {
        return await this.menusService.remove(id);
    }
};
exports.MenusController = MenusController;
__decorate([
    (0, common_1.Post)('menus'),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer un nouveau menu',
        description: 'Crée un nouveau menu pour un restaurant',
    }),
    (0, swagger_1.ApiBody)({
        type: create_menu_dto_1.CreateMenuDto,
        description: 'Données du menu à créer',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Le menu a été créé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Restaurant non trouvé',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_dto_1.CreateMenuDto]),
    __metadata("design:returntype", Promise)
], MenusController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('restaurants/:restaurantId/menus'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les menus d\'un restaurant',
        description: 'Retourne la liste des menus avec leurs items',
    }),
    (0, swagger_1.ApiParam)({
        name: 'restaurantId',
        type: String,
        description: 'ID du restaurant',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des menus récupérée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Restaurant non trouvé',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenusController.prototype, "findAllByRestaurant", null);
__decorate([
    (0, common_1.Get)('menus/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer un menu par son ID',
        description: 'Retourne les détails d\'un menu avec ses items et catégories',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'ID du menu',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Menu trouvé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Menu non trouvé',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenusController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('menus/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mettre à jour un menu',
        description: 'Met à jour les informations d\'un menu',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'ID du menu',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({
        type: update_menu_dto_1.UpdateMenuDto,
        description: 'Données du menu à mettre à jour',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Menu mis à jour avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Menu non trouvé',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_menu_dto_1.UpdateMenuDto]),
    __metadata("design:returntype", Promise)
], MenusController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('menus/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Supprimer un menu',
        description: 'Supprime un menu et tous ses items (cascade)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'ID du menu',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Menu supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Menu non trouvé',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenusController.prototype, "remove", null);
exports.MenusController = MenusController = __decorate([
    (0, swagger_1.ApiTags)('menus'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [menus_service_1.MenusService])
], MenusController);
//# sourceMappingURL=menus.controller.js.map