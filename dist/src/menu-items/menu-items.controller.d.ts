import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
export declare class MenuItemsController {
    private readonly menuItemsService;
    constructor(menuItemsService: MenuItemsService);
    create(createMenuItemDto: CreateMenuItemDto): Promise<{
        categories: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
        menu: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            restaurantId: string;
        };
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
    }>;
    findAllByMenu(menuId: string): Promise<({
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
    })[]>;
    findOne(id: string): Promise<{
        categories: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
        menu: {
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
        };
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
    }>;
    update(id: string, updateMenuItemDto: UpdateMenuItemDto): Promise<{
        categories: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
        menu: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            restaurantId: string;
        };
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
    }>;
    remove(id: string): Promise<void>;
}
