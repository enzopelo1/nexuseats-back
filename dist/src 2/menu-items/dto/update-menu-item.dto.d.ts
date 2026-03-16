import { CreateMenuItemDto } from './create-menu-item.dto';
declare const UpdateMenuItemDto_base: import("@nestjs/common").Type<Partial<CreateMenuItemDto>>;
export declare class UpdateMenuItemDto extends UpdateMenuItemDto_base {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    available?: boolean;
    categoryIds?: string[];
}
export {};
