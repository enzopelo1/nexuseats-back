import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
export declare class RestaurantsService {
    private restaurants;
    create(createRestaurantDto: CreateRestaurantDto, userId: number): Restaurant;
    findAll(page?: number, limit?: number): {
        data: Restaurant[];
        total: number;
        page: number;
        limit: number;
    };
    findOne(id: string): Restaurant;
    update(id: string, updateRestaurantDto: UpdateRestaurantDto): Restaurant;
    remove(id: string): void;
}
