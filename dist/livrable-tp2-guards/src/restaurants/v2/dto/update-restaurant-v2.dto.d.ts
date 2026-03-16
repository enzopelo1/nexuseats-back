import { CreateRestaurantV2Dto } from './create-restaurant-v2.dto';
import { CuisineType } from '@prisma/client';
declare const UpdateRestaurantV2Dto_base: import("@nestjs/common").Type<Partial<CreateRestaurantV2Dto>>;
export declare class UpdateRestaurantV2Dto extends UpdateRestaurantV2Dto_base {
    name?: string;
    address?: string;
    countryCode?: string;
    localNumber?: string;
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
