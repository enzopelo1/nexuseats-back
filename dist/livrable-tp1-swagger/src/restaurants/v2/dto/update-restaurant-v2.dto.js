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
exports.UpdateRestaurantV2Dto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_restaurant_v2_dto_1 = require("./create-restaurant-v2.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const address_dto_1 = require("./address.dto");
class UpdateRestaurantV2Dto extends (0, swagger_1.PartialType)(create_restaurant_v2_dto_1.CreateRestaurantV2Dto) {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, address: { required: false, type: () => require("./address.dto").AddressDto }, countryCode: { required: false, type: () => String }, localNumber: { required: false, type: () => String }, cuisineType: { required: false, type: () => Object }, phone: { required: false, type: () => String, pattern: "/^\\+?[0-9]{10,15}$/" }, email: { required: false, type: () => String, format: "email" }, rating: { required: false, type: () => Number, minimum: 0, maximum: 5 }, averagePrice: { required: false, type: () => Number, minimum: 0, maximum: 500 }, deliveryTime: { required: false, type: () => Number, minimum: 10, maximum: 120 }, isOpen: { required: false, type: () => Boolean }, description: { required: false, type: () => String }, imageUrl: { required: false, type: () => String }, specialties: { required: false, type: () => [String] }, categoryIds: { required: false, type: () => [String], format: "uuid", minItems: 1 } };
    }
}
exports.UpdateRestaurantV2Dto = UpdateRestaurantV2Dto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du restaurant',
        example: 'Chez Marco Rénové',
        required: false,
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantV2Dto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adresse du restaurant (objet imbriqué)',
        required: false,
        type: () => address_dto_1.AddressDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => address_dto_1.AddressDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", address_dto_1.AddressDto)
], UpdateRestaurantV2Dto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicatif téléphonique du pays (avec le +)',
        example: '+33',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantV2Dto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de téléphone local (sans indicatif pays)',
        example: '687654321',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantV2Dto.prototype, "localNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type de cuisine proposée par le restaurant',
        example: client_1.CuisineType.ITALIAN,
        enum: client_1.CuisineType,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(client_1.CuisineType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantV2Dto.prototype, "cuisineType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de téléphone au format international (+33612345678)',
        example: '+33612345678',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\+?[0-9]{10,15}$/, {
        message: 'Le numéro de téléphone doit contenir entre 10 et 15 chiffres (avec éventuellement un + en préfixe)',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantV2Dto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adresse email de contact du restaurant',
        example: 'contact@chezmarco.fr',
        required: false,
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantV2Dto.prototype, "email", void 0);
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
], UpdateRestaurantV2Dto.prototype, "rating", void 0);
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
], UpdateRestaurantV2Dto.prototype, "averagePrice", void 0);
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
], UpdateRestaurantV2Dto.prototype, "deliveryTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indique si le restaurant est actuellement ouvert',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateRestaurantV2Dto.prototype, "isOpen", void 0);
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
], UpdateRestaurantV2Dto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de l\'image du restaurant',
        example: 'https://example.com/images/restaurant-updated.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRestaurantV2Dto.prototype, "imageUrl", void 0);
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
], UpdateRestaurantV2Dto.prototype, "specialties", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Liste des identifiants de catégories associées au restaurant',
        example: ['a3f1e6b0-5c4d-4c2b-9f9f-1234567890ab'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateRestaurantV2Dto.prototype, "categoryIds", void 0);
//# sourceMappingURL=update-restaurant-v2.dto.js.map