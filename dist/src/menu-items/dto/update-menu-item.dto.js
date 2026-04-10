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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMenuItemDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_menu_item_dto_1 = require("./create-menu-item.dto");
const class_validator_1 = require("class-validator");
class UpdateMenuItemDto extends (0, swagger_1.PartialType)(create_menu_item_dto_1.CreateMenuItemDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, description: { required: false, type: () => String }, price: { required: false, type: () => Number, minimum: 0 }, imageUrl: { required: false, type: () => String }, available: { required: false, type: () => Boolean }, categoryIds: { required: false, type: () => [String], format: "uuid" } };
    }
}
exports.UpdateMenuItemDto = UpdateMenuItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom de l\'item',
        example: 'Pizza Margherita Deluxe',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description de l\'item',
        example: 'Pizza traditionnelle améliorée',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prix de l\'item en euros',
        example: 14.50,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateMenuItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de l\'image de l\'item',
        example: 'https://example.com/images/pizza-deluxe.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Disponibilité de l\'item',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateMenuItemDto.prototype, "available", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'IDs des catégories à associer (remplace toutes les catégories existantes)',
        example: ['550e8400-e29b-41d4-a716-446655440001'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateMenuItemDto.prototype, "categoryIds", void 0);
//# sourceMappingURL=update-menu-item.dto.js.map