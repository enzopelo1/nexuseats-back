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
exports.AddressDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddressDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { street: { required: true, type: () => String, minLength: 2, maxLength: 150 }, city: { required: true, type: () => String, minLength: 2, maxLength: 100 }, zipCode: { required: true, type: () => String, pattern: "/^\\d{5}$/" }, country: { required: true, type: () => String } };
    }
}
exports.AddressDto = AddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rue et numéro',
        example: '15 Rue de la Paix',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], AddressDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ville',
        example: 'Paris',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Code postal (5 chiffres)',
        example: '75002',
        pattern: '^\\d{5}$',
    }),
    (0, class_validator_1.Matches)(/^\d{5}$/, { message: 'Le code postal doit contenir exactement 5 chiffres' }),
    __metadata("design:type", String)
], AddressDto.prototype, "zipCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Code pays ISO 3166-1 alpha-2',
        example: 'FR',
    }),
    (0, class_validator_1.IsISO31661Alpha2)(),
    __metadata("design:type", String)
], AddressDto.prototype, "country", void 0);
//# sourceMappingURL=address.dto.js.map