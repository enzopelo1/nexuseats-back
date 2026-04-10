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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        cuisine: import(".prisma/client").$Enums.CuisineType;
        address: string;
        countryCode: string;
        localNumber: string;
        rating: number;
        averagePrice: import("@prisma/client-runtime-utils").Decimal;
        deliveryTime: number;
        isOpen: boolean;
        description: string | null;
        imageUrl: string | null;
        deletedAt: Date | null;
        ownerId: number | null;
    }>;
    findAll(page?: number, limit?: number, cuisine?: string, minRating?: number, maxRating?: number, isOpen?: string, search?: string, fields?: string): Promise<import("./restaurants-v2.service").PaginatedResponse<any>>;
    scroll(cursor?: string, limit?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            cuisine: import(".prisma/client").$Enums.CuisineType;
            address: string;
            countryCode: string;
            localNumber: string;
            rating: number;
            averagePrice: import("@prisma/client-runtime-utils").Decimal;
            deliveryTime: number;
            isOpen: boolean;
            description: string | null;
            imageUrl: string | null;
            deletedAt: Date | null;
            ownerId: number | null;
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
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                imageUrl: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
                available: boolean;
                menuId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            restaurantId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        cuisine: import(".prisma/client").$Enums.CuisineType;
        address: string;
        countryCode: string;
        localNumber: string;
        rating: number;
        averagePrice: import("@prisma/client-runtime-utils").Decimal;
        deliveryTime: number;
        isOpen: boolean;
        description: string | null;
        imageUrl: string | null;
        deletedAt: Date | null;
        ownerId: number | null;
    }>;
    update(id: string, updateRestaurantDto: UpdateRestaurantV2Dto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        cuisine: import(".prisma/client").$Enums.CuisineType;
        address: string;
        countryCode: string;
        localNumber: string;
        rating: number;
        averagePrice: import("@prisma/client-runtime-utils").Decimal;
        deliveryTime: number;
        isOpen: boolean;
        description: string | null;
        imageUrl: string | null;
        deletedAt: Date | null;
        ownerId: number | null;
    }>;
    remove(id: string): Promise<void>;
}
