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
exports.CreateRestaurantV2Dto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateRestaurantV2Dto {
}
exports.CreateRestaurantV2Dto = CreateRestaurantV2Dto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du restaurant',
        example: 'Chez Marco',
        required: true,
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRestaurantV2Dto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adresse complète du restaurant',
        example: '15 Rue de la Paix, 75002 Paris',
        required: true,
        minLength: 5,
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRestaurantV2Dto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicatif téléphonique du pays (avec le +)',
        example: '+33',
        required: true,
        pattern: '^\\+[1-9][0-9]{0,3}$',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRestaurantV2Dto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de téléphone local (sans indicatif pays)',
        example: '612345678',
        required: true,
        pattern: '^[0-9]{6,15}$',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRestaurantV2Dto.prototype, "localNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type de cuisine proposée par le restaurant',
        example: client_1.CuisineType.FRENCH,
        enum: client_1.CuisineType,
        required: true,
    }),
    (0, class_validator_1.IsEnum)(client_1.CuisineType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRestaurantV2Dto.prototype, "cuisineType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Note moyenne du restaurant (sur 5)',
        example: 4.5,
        minimum: 0,
        maximum: 5,
        required: false,
        default: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateRestaurantV2Dto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prix moyen d\'un repas en euros',
        example: 25.5,
        minimum: 0,
        maximum: 500,
        required: true,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], CreateRestaurantV2Dto.prototype, "averagePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Temps de livraison estimé en minutes',
        example: 30,
        minimum: 10,
        maximum: 120,
        required: true,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], CreateRestaurantV2Dto.prototype, "deliveryTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indique si le restaurant est actuellement ouvert',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRestaurantV2Dto.prototype, "isOpen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description détaillée du restaurant',
        example: 'Restaurant traditionnel français proposant une cuisine authentique et raffinée',
        required: false,
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRestaurantV2Dto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de l\'image du restaurant',
        example: 'https://example.com/images/restaurant.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRestaurantV2Dto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Liste des spécialités du restaurant',
        example: ['Coq au vin', 'Boeuf bourguignon', 'Crème brûlée'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateRestaurantV2Dto.prototype, "specialties", void 0);
//# sourceMappingURL=create-restaurant-v2.dto.js.map