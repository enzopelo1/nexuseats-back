import { CreateRestaurantV2Dto } from './create-restaurant-v2.dto';
import { CuisineType } from '@prisma/client';
import { AddressDto } from './address.dto';
declare const UpdateRestaurantV2Dto_base: import("@nestjs/common").Type<Partial<CreateRestaurantV2Dto>>;
export declare class UpdateRestaurantV2Dto extends UpdateRestaurantV2Dto_base {
    name?: string;
    address?: AddressDto;
    countryCode?: string;
    localNumber?: string;
    cuisineType?: CuisineType;
    phone?: string;
    email?: string;
    rating?: number;
    averagePrice?: number;
    deliveryTime?: number;
    isOpen?: boolean;
    description?: string;
    imageUrl?: string;
    specialties?: string[];
    categoryIds?: string[];
}
export {};
