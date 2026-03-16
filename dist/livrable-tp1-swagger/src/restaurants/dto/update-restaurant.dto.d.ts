import { CreateRestaurantDto, CuisineType } from './create-restaurant.dto';
declare const UpdateRestaurantDto_base: import("@nestjs/common").Type<Partial<CreateRestaurantDto>>;
export declare class UpdateRestaurantDto extends UpdateRestaurantDto_base {
    name?: string;
    address?: string;
    phone?: string;
    cuisineType?: CuisineType;
    rating?: number;
    averagePrice?: number;
    deliveryTime?: number;
    isOpen?: boolean;
    description?: string;
    imageUrl?: string;
    specialties?: string[];
}
export {};
