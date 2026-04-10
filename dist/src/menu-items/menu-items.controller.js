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
exports.MenuItemsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const menu_items_service_1 = require("./menu-items.service");
const create_menu_item_dto_1 = require("./dto/create-menu-item.dto");
const update_menu_item_dto_1 = require("./dto/update-menu-item.dto");
let MenuItemsController = class MenuItemsController {
    constructor(menuItemsService) {
        this.menuItemsService = menuItemsService;
    }
    async create(createMenuItemDto) {
        return await this.menuItemsService.create(createMenuItemDto);
    }
    async findAllByMenu(menuId) {
        return await this.menuItemsService.findAllByMenu(menuId);
    }
    async findOne(id) {
        return await this.menuItemsService.findOne(id);
    }
    async update(id, updateMenuItemDto) {
        return await this.menuItemsService.update(id, updateMenuItemDto);
    }
    async remove(id) {
        return await this.menuItemsService.remove(id);
    }
};
exports.MenuItemsController = MenuItemsController;
__decorate([
    (0, common_1.Post)('menu-items'),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer un nouvel item de menu',
        description: 'Crée un nouvel item pour un menu avec ses catégories',
    }),
    (0, swagger_1.ApiBody)({
        type: create_menu_item_dto_1.CreateMenuItemDto,
        description: 'Données de l\'item à créer',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'L\'item a été créé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Menu ou catégories non trouvés',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_item_dto_1.CreateMenuItemDto]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('menus/:menuId/items'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les items d\'un menu',
        description: 'Retourne la liste des items avec leurs catégories',
    }),
    (0, swagger_1.ApiParam)({
        name: 'menuId',
        type: String,
        description: 'ID du menu',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des items récupérée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Menu non trouvé',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('menuId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "findAllByMenu", null);
__decorate([
    (0, common_1.Get)('menu-items/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer un item par son ID',
        description: 'Retourne les détails d\'un item avec son menu et ses catégories',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'ID de l\'item',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Item trouvé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Item non trouvé',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('menu-items/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mettre à jour un item',
        description: 'Met à jour les informations d\'un item et ses catégories (N:M)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'ID de l\'item',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({
        type: update_menu_item_dto_1.UpdateMenuItemDto,
        description: 'Données de l\'item à mettre à jour',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Item mis à jour avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Item ou catégories non trouvés',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_menu_item_dto_1.UpdateMenuItemDto]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('menu-items/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Supprimer un item',
        description: 'Supprime un item de menu',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'ID de l\'item',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Item supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Item non trouvé',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "remove", null);
exports.MenuItemsController = MenuItemsController = __decorate([
    (0, swagger_1.ApiTags)('menu-items'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [menu_items_service_1.MenuItemsService])
], MenuItemsController);
//# sourceMappingURL=menu-items.controller.js.map