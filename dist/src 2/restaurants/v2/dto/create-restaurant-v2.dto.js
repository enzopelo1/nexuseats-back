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
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const address_dto_1 = require("./address.dto");
const is_unique_restaurant_name_validator_1 = require("../../../common/validators/is-unique-restaurant-name.validator");
class CreateRestaurantV2Dto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, address: { required: true, type: () => require("./address.dto").AddressDto }, countryCode: { required: true, type: () => String }, localNumber: { required: true, type: () => String }, cuisineType: { required: true, type: () => Object }, phone: { required: true, type: () => String, pattern: "/^\\+?[0-9]{10,15}$/" }, email: { required: true, type: () => String, format: "email" }, rating: { required: false, type: () => Number, minimum: 0, maximum: 5 }, averagePrice: { required: true, type: () => Number, minimum: 0, maximum: 500 }, deliveryTime: { required: true, type: () => Number, minimum: 10, maximum: 120 }, isOpen: { required: false, type: () => Boolean }, description: { required: false, type: () => String }, imageUrl: { required: false, type: () => String }, categoryIds: { required: true, type: () => [String], format: "uuid", minItems: 1 }, specialties: { required: false, type: () => [String] } };
    }
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
    (0, is_unique_restaurant_name_validator_1.IsUniqueRestaurantName)(),
    __metadata("design:type", String)
], CreateRestaurantV2Dto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adresse du restaurant (objet imbriqué)',
        required: true,
        type: () => address_dto_1.AddressDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => address_dto_1.AddressDto),
    __metadata("design:type", address_dto_1.AddressDto)
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
        description: 'Numéro de téléphone au format international (+33612345678)',
        example: '+33612345678',
        required: true,
        pattern: '^\\+?[0-9]{10,15}$',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\+?[0-9]{10,15}$/, {
        message: 'Le numéro de téléphone doit contenir entre 10 et 15 chiffres (avec éventuellement un + en préfixe)',
    }),
    __metadata("design:type", String)
], CreateRestaurantV2Dto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adresse email de contact du restaurant',
        example: 'contact@chezmarco.fr',
        required: true,
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateRestaurantV2Dto.prototype, "email", void 0);
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
        description: 'Liste des identifiants de catégories associées au restaurant',
        example: ['a3f1e6b0-5c4d-4c2b-9f9f-1234567890ab'],
        required: true,
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], CreateRestaurantV2Dto.prototype, "categoryIds", void 0);
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