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
exports.MenusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MenusService = class MenusService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMenuDto) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: {
                id: createMenuDto.restaurantId,
                deletedAt: null,
            },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant avec l'ID ${createMenuDto.restaurantId} non trouvé`);
        }
        return await this.prisma.menu.create({
            data: {
                name: createMenuDto.name,
                description: createMenuDto.description,
                restaurantId: createMenuDto.restaurantId,
            },
            include: {
                restaurant: true,
                items: true,
            },
        });
    }
    async findAllByRestaurant(restaurantId) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: {
                id: restaurantId,
                deletedAt: null,
            },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant avec l'ID ${restaurantId} non trouvé`);
        }
        return await this.prisma.menu.findMany({
            where: {
                restaurantId,
            },
            include: {
                items: {
                    include: {
                        categories: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async findOne(id) {
        const menu = await this.prisma.menu.findUnique({
            where: { id },
            include: {
                restaurant: true,
                items: {
                    include: {
                        categories: true,
                    },
                },
            },
        });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu avec l'ID ${id} non trouvé`);
        }
        return menu;
    }
    async update(id, updateMenuDto) {
        const menu = await this.prisma.menu.findUnique({
            where: { id },
        });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu avec l'ID ${id} non trouvé`);
        }
        return await this.prisma.menu.update({
            where: { id },
            data: {
                ...(updateMenuDto.name && { name: updateMenuDto.name }),
                ...(updateMenuDto.description !== undefined && { description: updateMenuDto.description }),
            },
            include: {
                restaurant: true,
                items: true,
            },
        });
    }
    async remove(id) {
        const menu = await this.prisma.menu.findUnique({
            where: { id },
        });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu avec l'ID ${id} non trouvé`);
        }
        await this.prisma.menu.delete({
            where: { id },
        });
    }
};
exports.MenusService = MenusService;
exports.MenusService = MenusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenusService);
//# sourceMappingURL=menus.service.js.map