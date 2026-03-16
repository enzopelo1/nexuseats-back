import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RestaurantsService {
  private restaurants: Restaurant[] = [];

  create(createRestaurantDto: CreateRestaurantDto, userId: number): Restaurant {
    const existingRestaurant = this.restaurants.find(
      (r) => r.name.toLowerCase() === createRestaurantDto.name.toLowerCase() &&
            r.address.toLowerCase() === createRestaurantDto.address.toLowerCase()
    );

    if (existingRestaurant) {
      throw new ConflictException('Un restaurant avec ce nom et cette adresse existe déjà');
    }

    const restaurant: Restaurant = {
      id: uuidv4(),
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

  findAll(page: number = 1, limit: number = 10): { data: Restaurant[]; total: number; page: number; limit: number } {
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

  findOne(id: string): Restaurant {
    const restaurant = this.restaurants.find((r) => r.id === id);
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
    }
    
    return restaurant;
  }

  update(id: string, updateRestaurantDto: UpdateRestaurantDto): Restaurant {
    const restaurantIndex = this.restaurants.findIndex((r) => r.id === id);
    
    if (restaurantIndex === -1) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
    }

    if (updateRestaurantDto.name || updateRestaurantDto.address) {
      const nameToCheck = updateRestaurantDto.name ?? this.restaurants[restaurantIndex].name;
      const addressToCheck = updateRestaurantDto.address ?? this.restaurants[restaurantIndex].address;
      
      const existingRestaurant = this.restaurants.find(
        (r) => r.id !== id &&
              r.name.toLowerCase() === nameToCheck.toLowerCase() &&
              r.address.toLowerCase() === addressToCheck.toLowerCase()
      );

      if (existingRestaurant) {
        throw new ConflictException('Un restaurant avec ce nom et cette adresse existe déjà');
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

  remove(id: string): void {
    const restaurantIndex = this.restaurants.findIndex((r) => r.id === id);
    
    if (restaurantIndex === -1) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
    }
    
    this.restaurants.splice(restaurantIndex, 1);
  }
}
