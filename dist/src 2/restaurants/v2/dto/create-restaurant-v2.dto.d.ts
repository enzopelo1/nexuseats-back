import { CuisineType } from '@prisma/client';
import { AddressDto } from './address.dto';
export declare class CreateRestaurantV2Dto {
    name: string;
    address: AddressDto;
    countryCode: string;
    localNumber: string;
    cuisineType: CuisineType;
    phone: string;
    email: string;
    rating?: number;
    averagePrice: number;
    deliveryTime: number;
    isOpen?: boolean;
    description?: string;
    imageUrl?: string;
    categoryIds: string[];
    specialties?: string[];
}
