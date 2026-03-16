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
    create(createRestaurantDto: CreateRestaurantV2Dto, userId: number): Promise<any>;
    findAll(page?: number, limit?: number, filters?: FindAllFilters, select?: Prisma.RestaurantSelect): Promise<PaginatedResponse<any>>;
    scroll(limit?: number, cursor?: string): Promise<{
        data: any;
        meta: {
            nextCursor: any;
            hasNext: boolean;
        };
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateRestaurantDto: UpdateRestaurantV2Dto): Promise<any>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<any>;
}
export {};
