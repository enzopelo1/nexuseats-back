import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRestaurantV2Dto } from './create-restaurant-v2.dto';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsOptional,
  IsArray,
  Matches,
  IsEmail,
  IsUUID,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CuisineType } from '@prisma/client';
import { AddressDto } from './address.dto';

export class UpdateRestaurantV2Dto extends PartialType(CreateRestaurantV2Dto) {
  @ApiProperty({
    description: 'Nom du restaurant',
    example: 'Chez Marco Rénové',
    required: false,
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Adresse du restaurant (objet imbriqué)',
    required: false,
    type: () => AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @ApiProperty({
    description: 'Indicatif téléphonique du pays (avec le +)',
    example: '+33',
    required: false,
  })
  @IsString()
  @IsOptional()
  countryCode?: string;

  @ApiProperty({
    description: 'Numéro de téléphone local (sans indicatif pays)',
    example: '687654321',
    required: false,
  })
  @IsString()
  @IsOptional()
  localNumber?: string;

  @ApiProperty({
    description: 'Type de cuisine proposée par le restaurant',
    example: CuisineType.ITALIAN,
    enum: CuisineType,
    required: false,
  })
  @IsEnum(CuisineType)
  @IsOptional()
  cuisineType?: CuisineType;

  @ApiProperty({
    description: 'Numéro de téléphone au format international (+33612345678)',
    example: '+33612345678',
    required: false,
  })
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: 'Le numéro de téléphone doit contenir entre 10 et 15 chiffres (avec éventuellement un + en préfixe)',
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Adresse email de contact du restaurant',
    example: 'contact@chezmarco.fr',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Note moyenne du restaurant (sur 5)',
    example: 4.8,
    minimum: 0,
    maximum: 5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiProperty({
    description: 'Prix moyen d\'un repas en euros',
    example: 28.0,
    minimum: 0,
    maximum: 500,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(500)
  averagePrice?: number;

  @ApiProperty({
    description: 'Temps de livraison estimé en minutes',
    example: 35,
    minimum: 10,
    maximum: 120,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(10)
  @Max(120)
  deliveryTime?: number;

  @ApiProperty({
    description: 'Indique si le restaurant est actuellement ouvert',
    example: false,
    required: false,
  })
  @IsOptional()
  isOpen?: boolean;

  @ApiProperty({
    description: 'Description détaillée du restaurant',
    example: 'Restaurant traditionnel français avec une nouvelle carte de saison',
    required: false,
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'URL de l\'image du restaurant',
    example: 'https://example.com/images/restaurant-updated.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Liste des spécialités du restaurant',
    example: ['Risotto aux truffes', 'Osso buco', 'Tiramisu'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialties?: string[];

  @ApiProperty({
    description: 'Liste des identifiants de catégories associées au restaurant',
    example: ['a3f1e6b0-5c4d-4c2b-9f9f-1234567890ab'],
    required: false,
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  @IsOptional()
  categoryIds?: string[];
}
