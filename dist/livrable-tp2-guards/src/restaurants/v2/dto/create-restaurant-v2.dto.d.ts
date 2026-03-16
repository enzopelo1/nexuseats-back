import { CuisineType } from '@prisma/client';
export declare class CreateRestaurantV2Dto {
    name: string;
    address: string;
    countryCode: string;
    localNumber: string;
    cuisineType: CuisineType;
    rating?: number;
    averagePrice: number;
    deliveryTime: number;
    isOpen?: boolean;
    description?: string;
    imageUrl?: string;
    specialties?: string[];
}
