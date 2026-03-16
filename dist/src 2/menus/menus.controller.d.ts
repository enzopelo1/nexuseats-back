import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenusController {
    private readonly menusService;
    constructor(menusService: MenusService);
    create(createMenuDto: CreateMenuDto): Promise<{
        items: {
            name: string;
            description: string | null;
            id: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            available: boolean;
            menuId: string;
        }[];
        restaurant: {
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
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    }>;
    findAllByRestaurant(restaurantId: string): Promise<({
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
    })[]>;
    findOne(id: string): Promise<{
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
        restaurant: {
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
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    }>;
    update(id: string, updateMenuDto: UpdateMenuDto): Promise<{
        items: {
            name: string;
            description: string | null;
            id: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            available: boolean;
            menuId: string;
        }[];
        restaurant: {
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
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    }>;
    remove(id: string): Promise<void>;
}
