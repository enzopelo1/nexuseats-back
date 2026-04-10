import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
export declare class RestaurantsV1Controller {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    create(createRestaurantDto: CreateRestaurantDto, user: {
        id: number;
        email: string;
        role: string;
    }): Restaurant;
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
