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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantsV2Service = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RestaurantsV2Service = class RestaurantsV2Service {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createRestaurantDto, userId) {
        const fullAddress = `${createRestaurantDto.address.street}, ${createRestaurantDto.address.zipCode} ${createRestaurantDto.address.city}, ${createRestaurantDto.address.country}`;
        const existingRestaurant = await this.prisma.restaurant.findFirst({
            where: {
                name: {
                    equals: createRestaurantDto.name,
                    mode: 'insensitive',
                },
                address: {
                    equals: fullAddress,
                    mode: 'insensitive',
                },
                deletedAt: null,
            },
        });
        if (existingRestaurant) {
            throw new common_1.ConflictException('Un restaurant avec ce nom et cette adresse existe déjà');
        }
        const restaurant = await this.prisma.restaurant.create({
            data: {
                name: createRestaurantDto.name,
                cuisine: createRestaurantDto.cuisineType,
                address: fullAddress,
                countryCode: createRestaurantDto.countryCode,
                localNumber: createRestaurantDto.localNumber,
                rating: createRestaurantDto.rating ?? 0,
                averagePrice: createRestaurantDto.averagePrice,
                deliveryTime: createRestaurantDto.deliveryTime,
                isOpen: createRestaurantDto.isOpen ?? true,
                description: createRestaurantDto.description,
                imageUrl: createRestaurantDto.imageUrl,
                ownerId: userId,
            },
        });
        return restaurant;
    }
    async findAll(page = 1, limit = 10, filters, select) {
        const currentPage = page < 1 ? 1 : page;
        const pageSize = Math.min(Math.max(limit, 1), 100);
        const where = {
            deletedAt: null,
        };
        if (filters?.cuisine) {
            where.cuisine = filters.cuisine;
        }
        if (filters?.minRating !== undefined) {
            where.rating = {
                ...(where.rating || {}),
                gte: filters.minRating,
            };
        }
        if (filters?.maxRating !== undefined) {
            where.rating = {
                ...(where.rating || {}),
                lte: filters.maxRating,
            };
        }
        if (filters?.isOpen !== undefined) {
            where.isOpen = filters.isOpen;
        }
        if (filters?.search) {
            where.OR = [
                {
                    name: {
                        contains: filters.search,
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: filters.search,
                        mode: 'insensitive',
                    },
                },
            ];
        }
        const skip = (currentPage - 1) * pageSize;
        const [restaurants, total] = await Promise.all([
            this.prisma.restaurant.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: [
                    { rating: 'desc' },
                    { createdAt: 'desc' },
                ],
                ...(select ? { select } : {}),
            }),
            this.prisma.restaurant.count({ where }),
        ]);
        const totalPages = Math.max(Math.ceil(total / pageSize), 1);
        const hasNext = currentPage < totalPages;
        const hasPrevious = currentPage > 1;
        return {
            data: restaurants,
            meta: {
                total,
                page: currentPage,
                limit: pageSize,
                totalPages,
                hasNext,
                hasPrevious,
            },
        };
    }
    async scroll(limit = 20, cursor) {
        const pageSize = Math.min(Math.max(limit, 1), 100);
        const take = pageSize + 1;
        const where = {
            deletedAt: null,
        };
        const restaurants = await this.prisma.restaurant.findMany({
            where,
            take,
            skip: cursor ? 1 : 0,
            ...(cursor ? { cursor: { id: cursor } } : {}),
            orderBy: [{ createdAt: 'desc' }],
        });
        const hasNext = restaurants.length === take;
        const data = hasNext ? restaurants.slice(0, -1) : restaurants;
        const nextCursor = hasNext && data.length > 0 ? data[data.length - 1].id : null;
        return {
            data,
            meta: {
                nextCursor,
                hasNext,
            },
        };
    }
    async findOne(id) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                menus: {
                    include: {
                        items: {
                            include: {
                                categories: true,
                            },
                        },
                    },
                },
            },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
        }
        return restaurant;
    }
    async update(id, updateRestaurantDto) {
        const existingRestaurant = await this.prisma.restaurant.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!existingRestaurant) {
            throw new common_1.NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
        }
        if (updateRestaurantDto.name || updateRestaurantDto.address) {
            const nameToCheck = updateRestaurantDto.name ?? existingRestaurant.name;
            const addressToCheck = updateRestaurantDto.address
                ? `${updateRestaurantDto.address.street}, ${updateRestaurantDto.address.zipCode} ${updateRestaurantDto.address.city}, ${updateRestaurantDto.address.country}`
                : existingRestaurant.address;
            const duplicate = await this.prisma.restaurant.findFirst({
                where: {
                    id: { not: id },
                    name: {
                        equals: nameToCheck,
                        mode: 'insensitive',
                    },
                    address: {
                        equals: addressToCheck,
                        mode: 'insensitive',
                    },
                    deletedAt: null,
                },
            });
            if (duplicate) {
                throw new common_1.ConflictException('Un restaurant avec ce nom et cette adresse existe déjà');
            }
        }
        const updateData = {};
        if (updateRestaurantDto.name)
            updateData.name = updateRestaurantDto.name;
        if (updateRestaurantDto.cuisineType)
            updateData.cuisine = updateRestaurantDto.cuisineType;
        if (updateRestaurantDto.address) {
            updateData.address = `${updateRestaurantDto.address.street}, ${updateRestaurantDto.address.zipCode} ${updateRestaurantDto.address.city}, ${updateRestaurantDto.address.country}`;
        }
        if (updateRestaurantDto.countryCode)
            updateData.countryCode = updateRestaurantDto.countryCode;
        if (updateRestaurantDto.localNumber)
            updateData.localNumber = updateRestaurantDto.localNumber;
        if (updateRestaurantDto.rating !== undefined)
            updateData.rating = updateRestaurantDto.rating;
        if (updateRestaurantDto.averagePrice !== undefined)
            updateData.averagePrice = updateRestaurantDto.averagePrice;
        if (updateRestaurantDto.deliveryTime !== undefined)
            updateData.deliveryTime = updateRestaurantDto.deliveryTime;
        if (updateRestaurantDto.isOpen !== undefined)
            updateData.isOpen = updateRestaurantDto.isOpen;
        if (updateRestaurantDto.description !== undefined)
            updateData.description = updateRestaurantDto.description;
        if (updateRestaurantDto.imageUrl !== undefined)
            updateData.imageUrl = updateRestaurantDto.imageUrl;
        const updated = await this.prisma.restaurant.update({
            where: { id },
            data: updateData,
        });
        return updated;
    }
    async remove(id) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
        }
        await this.prisma.restaurant.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
    async restore(id) {
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
        }
        if (!restaurant.deletedAt) {
            throw new common_1.ConflictException('Ce restaurant n\'est pas supprimé');
        }
        return await this.prisma.restaurant.update({
            where: { id },
            data: {
                deletedAt: null,
            },
        });
    }
};
exports.RestaurantsV2Service = RestaurantsV2Service;
exports.RestaurantsV2Service = RestaurantsV2Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], RestaurantsV2Service);
//# sourceMappingURL=restaurants-v2.service.js.map