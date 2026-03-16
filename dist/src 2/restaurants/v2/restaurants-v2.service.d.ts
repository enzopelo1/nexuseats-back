import { CreateRestaurantV2Dto } from './dto/create-restaurant-v2.dto';
import { UpdateRestaurantV2Dto } from './dto/update-restaurant-v2.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CuisineType as PrismaCuisineType } from '@prisma/client';
export interface PaginationMetadata {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMetadata;
}
interface FindAllFilters {
    cuisine?: PrismaCuisineType;
    minRating?: number;
    maxRating?: number;
    isOpen?: boolean;
    search?: string;
}
export declare class RestaurantsV2Service {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createRestaurantDto: CreateRestaurantV2Dto, userId: number): Promise<{
        name: string;
        description: string | null;
        id: string;
        address: string;
        rating: number;
        averagePrice: Prisma.Decimal;
        deliveryTime: number;
        isOpen: boolean;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number | null;
        countryCode: string;
        localNumber: string;
        cuisine: import(".prisma/client").$Enums.CuisineType;
        deletedAt: Date | null;
    }>;
    findAll(page?: number, limit?: number, filters?: FindAllFilters, select?: Prisma.RestaurantSelect): Promise<PaginatedResponse<any>>;
    scroll(limit?: number, cursor?: string): Promise<{
        data: {
            name: string;
            description: string | null;
            id: string;
            address: string;
            rating: number;
            averagePrice: Prisma.Decimal;
            deliveryTime: number;
            isOpen: boolean;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            ownerId: number | null;
            countryCode: string;
            localNumber: string;
            cuisine: import(".prisma/client").$Enums.CuisineType;
            deletedAt: Date | null;
        }[];
        meta: {
            nextCursor: string;
            hasNext: boolean;
        };
    }>;
    findOne(id: string): Promise<{
        menus: ({
            items: ({
                categories: {
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                }[];
            } & {
                name: string;
                description: string | null;
                id: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
                price: Prisma.Decimal;
                available: boolean;
                menuId: string;
            })[];
        } & {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
        })[];
    } & {
        name: string;
        description: string | null;
        id: string;
        address: string;
        rating: number;
        averagePrice: Prisma.Decimal;
        deliveryTime: number;
        isOpen: boolean;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number | null;
        countryCode: string;
        localNumber: string;
        cuisine: import(".prisma/client").$Enums.CuisineType;
        deletedAt: Date | null;
    }>;
    update(id: string, updateRestaurantDto: UpdateRestaurantV2Dto): Promise<{
        name: string;
        description: string | null;
        id: string;
        address: string;
        rating: number;
        averagePrice: Prisma.Decimal;
        deliveryTime: number;
        isOpen: boolean;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number | null;
        countryCode: string;
        localNumber: string;
        cuisine: import(".prisma/client").$Enums.CuisineType;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        address: string;
        rating: number;
        averagePrice: Prisma.Decimal;
        deliveryTime: number;
        isOpen: boolean;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number | null;
        countryCode: string;
        localNumber: string;
        cuisine: import(".prisma/client").$Enums.CuisineType;
        deletedAt: Date | null;
    }>;
}
export {};
