import { RestaurantsV2Service } from './restaurants-v2.service';
import { CreateRestaurantV2Dto } from './dto/create-restaurant-v2.dto';
import { UpdateRestaurantV2Dto } from './dto/update-restaurant-v2.dto';
export declare class RestaurantsV2Controller {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsV2Service);
    create(createRestaurantDto: CreateRestaurantV2Dto, user: {
        id: number;
        email: string;
        role: string;
    }): Promise<any>;
    findAll(page?: number, limit?: number, cuisine?: string, minRating?: number, maxRating?: number, isOpen?: string, search?: string): Promise<import("./restaurants-v2.service").PaginatedResponse<any>>;
    findOne(id: string): Promise<any>;
    update(id: string, updateRestaurantDto: UpdateRestaurantV2Dto): Promise<any>;
    remove(id: string): Promise<void>;
}
