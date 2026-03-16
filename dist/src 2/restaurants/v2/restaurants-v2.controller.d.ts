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
    }): Promise<{
        name: string;
        description: string | null;
        id: string;
        address: string;
        rating: number;
        averagePrice: import("@prisma/client-runtime-utils").Decimal;
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
    findAll(page?: number, limit?: number, cuisine?: string, minRating?: number, maxRating?: number, isOpen?: string, search?: string, fields?: string): Promise<import("./restaurants-v2.service").PaginatedResponse<any>>;
    scroll(cursor?: string, limit?: number): Promise<{
        data: {
            name: string;
            description: string | null;
            id: string;
            address: string;
            rating: number;
            averagePrice: import("@prisma/client-runtime-utils").Decimal;
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
                price: import("@prisma/client-runtime-utils").Decimal;
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
        averagePrice: import("@prisma/client-runtime-utils").Decimal;
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
        averagePrice: import("@prisma/client-runtime-utils").Decimal;
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
}
