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
exports.CreateRestaurantDto = exports.CuisineType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var CuisineType;
(function (CuisineType) {
    CuisineType["FRENCH"] = "french";
    CuisineType["ITALIAN"] = "italian";
    CuisineType["JAPANESE"] = "japanese";
    CuisineType["CHINESE"] = "chinese";
    CuisineType["INDIAN"] = "indian";
    CuisineType["MEXICAN"] = "mexican";
    CuisineType["AMERICAN"] = "american";
    CuisineType["MEDITERRANEAN"] = "mediterranean";
    CuisineType["THAI"] = "thai";
    CuisineType["OTHER"] = "other";
})(CuisineType || (exports.CuisineType = CuisineType = {}));
class CreateRestaurantDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, address: { required: true, type: () => String }, phone: { required: true, type: () => String }, cuisineType: { required: true, enum: require("./create-restaurant.dto").CuisineType }, rating: { required: false, type: () => Number, minimum: 0, maximum: 5 }, averagePrice: { required: true, type: () => Number, minimum: 0, maximum: 500 }, deliveryTime: { required: true, type: () => Number, minimum: 10, maximum: 120 }, isOpen: { required: false, type: () => Boolean }, description: { required: false, type: () => String }, imageUrl: { required: false, type: () => String }, specialties: { required: false, type: () => [String] } };
    }
}
exports.CreateRestaurantDto = CreateRestaurantDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du restaurant',
        example: 'Le Petit Bistrot',
        required: true,
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "name", void 0);
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
], CreateRestaurantDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de téléphone du restaurant',
        example: '+33 1 42 86 82 82',
        required: true,
        pattern: '^[+]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,9}$',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type de cuisine proposée par le restaurant',
        example: CuisineType.FRENCH,
        enum: CuisineType,
        required: true,
    }),
    (0, class_validator_1.IsEnum)(CuisineType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "cuisineType", void 0);
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
], CreateRestaurantDto.prototype, "rating", void 0);
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
], CreateRestaurantDto.prototype, "averagePrice", void 0);
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
], CreateRestaurantDto.prototype, "deliveryTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indique si le restaurant est actuellement ouvert',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRestaurantDto.prototype, "isOpen", void 0);
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
], CreateRestaurantDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de l\'image du restaurant',
        example: 'https://example.com/images/restaurant.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "imageUrl", void 0);
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
], CreateRestaurantDto.prototype, "specialties", void 0);
//# sourceMappingURL=create-restaurant.dto.js.map