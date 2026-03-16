import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
export declare class MenuItemsController {
    private readonly menuItemsService;
    constructor(menuItemsService: MenuItemsService);
    create(createMenuItemDto: CreateMenuItemDto): Promise<{
        categories: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        menu: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
        };
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
    }>;
    findAllByMenu(menuId: string): Promise<({
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
    })[]>;
    findOne(id: string): Promise<{
        categories: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        menu: {
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
        };
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
    }>;
    update(id: string, updateMenuItemDto: UpdateMenuItemDto): Promise<{
        categories: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        menu: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
        };
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
    }>;
    remove(id: string): Promise<void>;
}
