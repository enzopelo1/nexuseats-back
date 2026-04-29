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
exports.Restaurant = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_restaurant_dto_1 = require("../dto/create-restaurant.dto");
class Restaurant {
}
exports.Restaurant = Restaurant;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identifiant unique du restaurant',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], Restaurant.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du restaurant',
        example: 'Le Petit Bistrot',
    }),
    __metadata("design:type", String)
], Restaurant.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adresse complète du restaurant',
        example: '15 Rue de la Paix, 75002 Paris',
    }),
    __metadata("design:type", String)
], Restaurant.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de téléphone du restaurant',
        example: '+33 1 42 86 82 82',
    }),
    __metadata("design:type", String)
], Restaurant.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type de cuisine proposée par le restaurant',
        example: create_restaurant_dto_1.CuisineType.FRENCH,
        enum: create_restaurant_dto_1.CuisineType,
    }),
    __metadata("design:type", String)
], Restaurant.prototype, "cuisineType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Note moyenne du restaurant (sur 5)',
        example: 4.5,
    }),
    __metadata("design:type", Number)
], Restaurant.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prix moyen d\'un repas en euros',
        example: 25.5,
    }),
    __metadata("design:type", Number)
], Restaurant.prototype, "averagePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Temps de livraison estimé en minutes',
        example: 30,
    }),
    __metadata("design:type", Number)
], Restaurant.prototype, "deliveryTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indique si le restaurant est actuellement ouvert',
        example: true,
    }),
    __metadata("design:type", Boolean)
], Restaurant.prototype, "isOpen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description détaillée du restaurant',
        example: 'Restaurant traditionnel français proposant une cuisine authentique et raffinée',
        required: false,
    }),
    __metadata("design:type", String)
], Restaurant.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de l\'image du restaurant',
        example: 'https://example.com/images/restaurant.jpg',
        required: false,
    }),
    __metadata("design:type", String)
], Restaurant.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Liste des spécialités du restaurant',
        example: ['Coq au vin', 'Boeuf bourguignon', 'Crème brûlée'],
        type: [String],
        required: false,
    }),
    __metadata("design:type", Array)
], Restaurant.prototype, "specialties", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de création du restaurant',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], Restaurant.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de dernière mise à jour du restaurant',
        example: '2024-02-20T14:45:00Z',
    }),
    __metadata("design:type", Date)
], Restaurant.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID du propriétaire du restaurant',
        example: 1,
        required: false,
    }),
    __metadata("design:type", Number)
], Restaurant.prototype, "ownerId", void 0);
//# sourceMappingURL=restaurant.entity.js.map