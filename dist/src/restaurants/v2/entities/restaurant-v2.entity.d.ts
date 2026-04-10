import { CuisineType } from '@prisma/client';
export declare class RestaurantV2 {
    id: string;
    name: string;
    address: string;
    countryCode: string;
    localNumber: string;
    cuisineType: CuisineType;
    rating: number;
    averagePrice: number;
    deliveryTime: number;
    isOpen: boolean;
    description?: string;
    imageUrl?: string;
    specialties?: string[];
    createdAt: Date;
    updatedAt: Date;
}
