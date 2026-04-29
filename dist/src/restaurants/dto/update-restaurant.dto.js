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
exports.UpdateRestaurantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_restaurant_dto_1 = require("./create-restaurant.dto");
const class_validator_1 = require("class-validator");
class UpdateRestaurantDto extends (0, swagger_1.PartialType)(create_restaurant_dto_1.CreateRestaurantDto) {
}
exports.UpdateRestaurantDto = UpdateRestaurantDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du restaurant',
        example: 'Le Petit Bistrot Rénové',
        required: false,
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adresse complète du restaurant',
        example: '20 Rue de la Paix, 75002 Paris',
        required: false,
        minLength: 5,
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de téléphone du restaurant',
        example: '+33 1 42 86 82 83',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type de cuisine proposée par le restaurant',
        example: create_restaurant_dto_1.CuisineType.ITALIAN,
        enum: create_restaurant_dto_1.CuisineType,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(create_restaurant_dto_1.CuisineType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantDto.prototype, "cuisineType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Note moyenne du restaurant (sur 5)',
        example: 4.8,
        minimum: 0,
        maximum: 5,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], UpdateRestaurantDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prix moyen d\'un repas en euros',
        example: 28.0,
        minimum: 0,
        maximum: 500,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], UpdateRestaurantDto.prototype, "averagePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Temps de livraison estimé en minutes',
        example: 35,
        minimum: 10,
        maximum: 120,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], UpdateRestaurantDto.prototype, "deliveryTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indique si le restaurant est actuellement ouvert',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateRestaurantDto.prototype, "isOpen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description détaillée du restaurant',
        example: 'Restaurant traditionnel français avec une nouvelle carte de saison',
        required: false,
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de l\'image du restaurant',
        example: 'https://example.com/images/restaurant-updated.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Liste des spécialités du restaurant',
        example: ['Risotto aux truffes', 'Osso buco', 'Tiramisu'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateRestaurantDto.prototype, "specialties", void 0);
//# sourceMappingURL=update-restaurant.dto.js.map