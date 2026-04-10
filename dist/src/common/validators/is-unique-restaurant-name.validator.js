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
exports.IsUniqueRestaurantNameConstraint = void 0;
exports.IsUniqueRestaurantName = IsUniqueRestaurantName;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../../prisma/prisma.service");
let IsUniqueRestaurantNameConstraint = class IsUniqueRestaurantNameConstraint {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validate(value) {
        if (typeof value !== 'string' || !value.trim()) {
            return false;
        }
        const existing = await this.prisma.restaurant.findFirst({
            where: {
                name: {
                    equals: value,
                    mode: 'insensitive',
                },
                deletedAt: null,
            },
            select: { id: true },
        });
        return !existing;
    }
    defaultMessage(args) {
        return `Un restaurant avec le nom "${args?.value}" existe déjà`;
    }
};
exports.IsUniqueRestaurantNameConstraint = IsUniqueRestaurantNameConstraint;
exports.IsUniqueRestaurantNameConstraint = IsUniqueRestaurantNameConstraint = __decorate([
    (0, common_1.Injectable)(),
    (0, class_validator_1.ValidatorConstraint)({ async: true }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IsUniqueRestaurantNameConstraint);
function IsUniqueRestaurantName(validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'IsUniqueRestaurantName',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsUniqueRestaurantNameConstraint,
        });
    };
}
//# sourceMappingURL=is-unique-restaurant-name.validator.js.map