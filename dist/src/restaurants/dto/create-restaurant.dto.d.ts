export declare enum CuisineType {
    FRENCH = "french",
    ITALIAN = "italian",
    JAPANESE = "japanese",
    CHINESE = "chinese",
    INDIAN = "indian",
    MEXICAN = "mexican",
    AMERICAN = "american",
    MEDITERRANEAN = "mediterranean",
    THAI = "thai",
    OTHER = "other"
}
export declare class CreateRestaurantDto {
    name: string;
    address: string;
    phone: string;
    cuisineType: CuisineType;
    rating?: number;
    averagePrice: number;
    deliveryTime: number;
    isOpen?: boolean;
    description?: string;
    imageUrl?: string;
    specialties?: string[];
}
