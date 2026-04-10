"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let RestaurantsService = class RestaurantsService {
    constructor() {
        this.restaurants = [];
    }
    create(createRestaurantDto, userId) {
        const existingRestaurant = this.restaurants.find((r) => r.name.toLowerCase() === createRestaurantDto.name.toLowerCase() &&
            r.address.toLowerCase() === createRestaurantDto.address.toLowerCase());
        if (existingRestaurant) {
            throw new common_1.ConflictException('Un restaurant avec ce nom et cette adresse existe déjà');
        }
        const restaurant = {
            id: (0, uuid_1.v4)(),
            ...createRestaurantDto,
            ownerId: userId,
            rating: createRestaurantDto.rating ?? 0,
            isOpen: createRestaurantDto.isOpen ?? true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.restaurants.push(restaurant);
        return restaurant;
    }
    findAll(page = 1, limit = 10) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRestaurants = this.restaurants.slice(startIndex, endIndex);
        return {
            data: paginatedRestaurants,
            total: this.restaurants.length,
            page,
            limit,
        };
    }
    findOne(id) {
        const restaurant = this.restaurants.find((r) => r.id === id);
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
        }
        return restaurant;
    }
    update(id, updateRestaurantDto) {
        const restaurantIndex = this.restaurants.findIndex((r) => r.id === id);
        if (restaurantIndex === -1) {
            throw new common_1.NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
        }
        if (updateRestaurantDto.name || updateRestaurantDto.address) {
            const nameToCheck = updateRestaurantDto.name ?? this.restaurants[restaurantIndex].name;
            const addressToCheck = updateRestaurantDto.address ?? this.restaurants[restaurantIndex].address;
            const existingRestaurant = this.restaurants.find((r) => r.id !== id &&
                r.name.toLowerCase() === nameToCheck.toLowerCase() &&
                r.address.toLowerCase() === addressToCheck.toLowerCase());
            if (existingRestaurant) {
                throw new common_1.ConflictException('Un restaurant avec ce nom et cette adresse existe déjà');
            }
        }
        const updatedRestaurant = {
            ...this.restaurants[restaurantIndex],
            ...updateRestaurantDto,
            updatedAt: new Date(),
        };
        this.restaurants[restaurantIndex] = updatedRestaurant;
        return updatedRestaurant;
    }
    remove(id) {
        const restaurantIndex = this.restaurants.findIndex((r) => r.id === id);
        if (restaurantIndex === -1) {
            throw new common_1.NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
        }
        this.restaurants.splice(restaurantIndex, 1);
    }
};
exports.RestaurantsService = RestaurantsService;
exports.RestaurantsService = RestaurantsService = __decorate([
    (0, common_1.Injectable)()
], RestaurantsService);
//# sourceMappingURL=restaurants.service.js.map