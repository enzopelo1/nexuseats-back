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
exports.MenuItemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MenuItemsService = class MenuItemsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMenuItemDto) {
        const menu = await this.prisma.menu.findUnique({
            where: { id: createMenuItemDto.menuId },
        });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu avec l'ID ${createMenuItemDto.menuId} non trouvé`);
        }
        if (createMenuItemDto.categoryIds && createMenuItemDto.categoryIds.length > 0) {
            const categories = await this.prisma.category.findMany({
                where: {
                    id: { in: createMenuItemDto.categoryIds },
                },
            });
            if (categories.length !== createMenuItemDto.categoryIds.length) {
                throw new common_1.NotFoundException('Une ou plusieurs catégories n\'existent pas');
            }
        }
        return await this.prisma.menuItem.create({
            data: {
                name: createMenuItemDto.name,
                description: createMenuItemDto.description,
                price: createMenuItemDto.price,
                imageUrl: createMenuItemDto.imageUrl,
                available: createMenuItemDto.available ?? true,
                menuId: createMenuItemDto.menuId,
                ...(createMenuItemDto.categoryIds && createMenuItemDto.categoryIds.length > 0 && {
                    categories: {
                        connect: createMenuItemDto.categoryIds.map((id) => ({ id })),
                    },
                }),
            },
            include: {
                menu: true,
                categories: true,
            },
        });
    }
    async findAllByMenu(menuId) {
        const menu = await this.prisma.menu.findUnique({
            where: { id: menuId },
        });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu avec l'ID ${menuId} non trouvé`);
        }
        return await this.prisma.menuItem.findMany({
            where: {
                menuId,
            },
            include: {
                categories: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async findOne(id) {
        const menuItem = await this.prisma.menuItem.findUnique({
            where: { id },
            include: {
                menu: {
                    include: {
                        restaurant: true,
                    },
                },
                categories: true,
            },
        });
        if (!menuItem) {
            throw new common_1.NotFoundException(`MenuItem avec l'ID ${id} non trouvé`);
        }
        return menuItem;
    }
    async update(id, updateMenuItemDto) {
        const menuItem = await this.prisma.menuItem.findUnique({
            where: { id },
            include: {
                categories: true,
            },
        });
        if (!menuItem) {
            throw new common_1.NotFoundException(`MenuItem avec l'ID ${id} non trouvé`);
        }
        if (updateMenuItemDto.categoryIds && updateMenuItemDto.categoryIds.length > 0) {
            const categories = await this.prisma.category.findMany({
                where: {
                    id: { in: updateMenuItemDto.categoryIds },
                },
            });
            if (categories.length !== updateMenuItemDto.categoryIds.length) {
                throw new common_1.NotFoundException('Une ou plusieurs catégories n\'existent pas');
            }
        }
        const updateData = {
            ...(updateMenuItemDto.name && { name: updateMenuItemDto.name }),
            ...(updateMenuItemDto.description !== undefined && { description: updateMenuItemDto.description }),
            ...(updateMenuItemDto.price !== undefined && { price: updateMenuItemDto.price }),
            ...(updateMenuItemDto.imageUrl !== undefined && { imageUrl: updateMenuItemDto.imageUrl }),
            ...(updateMenuItemDto.available !== undefined && { available: updateMenuItemDto.available }),
        };
        if (updateMenuItemDto.categoryIds !== undefined) {
            updateData.categories = {
                set: [],
                connect: updateMenuItemDto.categoryIds.map((id) => ({ id })),
            };
        }
        return await this.prisma.menuItem.update({
            where: { id },
            data: updateData,
            include: {
                menu: true,
                categories: true,
            },
        });
    }
    async remove(id) {
        const menuItem = await this.prisma.menuItem.findUnique({
            where: { id },
        });
        if (!menuItem) {
            throw new common_1.NotFoundException(`MenuItem avec l'ID ${id} non trouvé`);
        }
        await this.prisma.menuItem.delete({
            where: { id },
        });
    }
};
exports.MenuItemsService = MenuItemsService;
exports.MenuItemsService = MenuItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuItemsService);
//# sourceMappingURL=menu-items.service.js.map