import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenusController {
    private readonly menusService;
    constructor(menusService: MenusService);
    create(createMenuDto: CreateMenuDto): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            imageUrl: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            available: boolean;
            menuId: string;
        }[];
        restaurant: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        restaurantId: string;
    }>;
    findAllByRestaurant(restaurantId: string): Promise<({
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
    })[]>;
    findOne(id: string): Promise<{
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
        restaurant: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        restaurantId: string;
    }>;
    update(id: string, updateMenuDto: UpdateMenuDto): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            imageUrl: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            available: boolean;
            menuId: string;
        }[];
        restaurant: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        restaurantId: string;
    }>;
    remove(id: string): Promise<void>;
}
