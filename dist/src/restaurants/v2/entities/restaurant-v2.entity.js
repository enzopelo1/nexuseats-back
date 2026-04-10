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
exports.RestaurantV2 = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class RestaurantV2 {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, address: { required: true, type: () => String }, countryCode: { required: true, type: () => String }, localNumber: { required: true, type: () => String }, cuisineType: { required: true, type: () => Object }, rating: { required: true, type: () => Number }, averagePrice: { required: true, type: () => Number }, deliveryTime: { required: true, type: () => Number }, isOpen: { required: true, type: () => Boolean }, description: { required: false, type: () => String }, imageUrl: { required: false, type: () => String }, specialties: { required: false, type: () => [String] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.RestaurantV2 = RestaurantV2;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identifiant unique du restaurant',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], RestaurantV2.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du restaurant',
        example: 'Chez Marco',
    }),
    __metadata("design:type", String)
], RestaurantV2.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adresse complète du restaurant',
        example: '15 Rue de la Paix, 75002 Paris',
    }),
    __metadata("design:type", String)
], RestaurantV2.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicatif téléphonique du pays',
        example: '+33',
    }),
    __metadata("design:type", String)
], RestaurantV2.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de téléphone local',
        example: '612345678',
    }),
    __metadata("design:type", String)
], RestaurantV2.prototype, "localNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type de cuisine proposée par le restaurant',
        example: client_1.CuisineType.FRENCH,
        enum: client_1.CuisineType,
    }),
    __metadata("design:type", String)
], RestaurantV2.prototype, "cuisineType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Note moyenne du restaurant (sur 5)',
        example: 4.5,
    }),
    __metadata("design:type", Number)
], RestaurantV2.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prix moyen d\'un repas en euros',
        example: 25.5,
    }),
    __metadata("design:type", Number)
], RestaurantV2.prototype, "averagePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Temps de livraison estimé en minutes',
        example: 30,
    }),
    __metadata("design:type", Number)
], RestaurantV2.prototype, "deliveryTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indique si le restaurant est actuellement ouvert',
        example: true,
    }),
    __metadata("design:type", Boolean)
], RestaurantV2.prototype, "isOpen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description détaillée du restaurant',
        example: 'Restaurant traditionnel français proposant une cuisine authentique et raffinée',
        required: false,
    }),
    __metadata("design:type", String)
], RestaurantV2.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de l\'image du restaurant',
        example: 'https://example.com/images/restaurant.jpg',
        required: false,
    }),
    __metadata("design:type", String)
], RestaurantV2.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Liste des spécialités du restaurant',
        example: ['Coq au vin', 'Boeuf bourguignon', 'Crème brûlée'],
        type: [String],
        required: false,
    }),
    __metadata("design:type", Array)
], RestaurantV2.prototype, "specialties", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de création du restaurant',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], RestaurantV2.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de dernière mise à jour du restaurant',
        example: '2024-02-20T14:45:00Z',
    }),
    __metadata("design:type", Date)
], RestaurantV2.prototype, "updatedAt", void 0);
//# sourceMappingURL=restaurant-v2.entity.js.map