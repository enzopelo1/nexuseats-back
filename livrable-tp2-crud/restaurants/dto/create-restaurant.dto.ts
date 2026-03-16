import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, Max, IsEnum, IsOptional, IsArray } from 'class-validator';

export enum CuisineType {
  FRENCH = 'french',
  ITALIAN = 'italian',
  JAPANESE = 'japanese',
  CHINESE = 'chinese',
  INDIAN = 'indian',
  MEXICAN = 'mexican',
  AMERICAN = 'american',
  MEDITERRANEAN = 'mediterranean',
  THAI = 'thai',
  OTHER = 'other',
}

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'Nom du restaurant',
    example: 'Le Petit Bistrot',
    required: true,
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Adresse complète du restaurant',
    example: '15 Rue de la Paix, 75002 Paris',
    required: true,
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Numéro de téléphone du restaurant',
    example: '+33 1 42 86 82 82',
    required: true,
    pattern: '^[+]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,9}$',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Type de cuisine proposée par le restaurant',
    example: CuisineType.FRENCH,
    enum: CuisineType,
    required: true,
  })
  @IsEnum(CuisineType)
  @IsNotEmpty()
  cuisineType: CuisineType;

  @ApiProperty({
    description: 'Note moyenne du restaurant (sur 5)',
    example: 4.5,
    minimum: 0,
    maximum: 5,
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiProperty({
    description: 'Prix moyen d\'un repas en euros',
    example: 25.5,
    minimum: 0,
    maximum: 500,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(500)
  averagePrice: number;

  @ApiProperty({
    description: 'Temps de livraison estimé en minutes',
    example: 30,
    minimum: 10,
    maximum: 120,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  @Max(120)
  deliveryTime: number;

  @ApiProperty({
    description: 'Indique si le restaurant est actuellement ouvert',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  isOpen?: boolean;

  @ApiProperty({
    description: 'Description détaillée du restaurant',
    example: 'Restaurant traditionnel français proposant une cuisine authentique et raffinée',
    required: false,
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'URL de l\'image du restaurant',
    example: 'https://example.com/images/restaurant.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Liste des spécialités du restaurant',
    example: ['Coq au vin', 'Boeuf bourguignon', 'Crème brûlée'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialties?: string[];
}
