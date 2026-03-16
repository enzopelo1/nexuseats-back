import { CuisineType } from '../dto/create-restaurant.dto';
export declare class Restaurant {
    id: string;
    name: string;
    address: string;
    phone: string;
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
    ownerId?: number;
}
