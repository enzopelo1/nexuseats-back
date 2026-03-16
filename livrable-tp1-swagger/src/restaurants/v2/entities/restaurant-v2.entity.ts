import { ApiProperty } from '@nestjs/swagger';
import { CuisineType } from '@prisma/client';

export class RestaurantV2 {
  @ApiProperty({
    description: 'Identifiant unique du restaurant',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nom du restaurant',
    example: 'Chez Marco',
  })
  name: string;

  @ApiProperty({
    description: 'Adresse complète du restaurant',
    example: '15 Rue de la Paix, 75002 Paris',
  })
  address: string;

  @ApiProperty({
    description: 'Indicatif téléphonique du pays',
    example: '+33',
  })
  countryCode: string;

  @ApiProperty({
    description: 'Numéro de téléphone local',
    example: '612345678',
  })
  localNumber: string;

  @ApiProperty({
    description: 'Type de cuisine proposée par le restaurant',
    example: CuisineType.FRENCH,
    enum: CuisineType,
  })
  cuisineType: CuisineType;

  @ApiProperty({
    description: 'Note moyenne du restaurant (sur 5)',
    example: 4.5,
  })
  rating: number;

  @ApiProperty({
    description: 'Prix moyen d\'un repas en euros',
    example: 25.5,
  })
  averagePrice: number;

  @ApiProperty({
    description: 'Temps de livraison estimé en minutes',
    example: 30,
  })
  deliveryTime: number;

  @ApiProperty({
    description: 'Indique si le restaurant est actuellement ouvert',
    example: true,
  })
  isOpen: boolean;

  @ApiProperty({
    description: 'Description détaillée du restaurant',
    example: 'Restaurant traditionnel français proposant une cuisine authentique et raffinée',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'URL de l\'image du restaurant',
    example: 'https://example.com/images/restaurant.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Liste des spécialités du restaurant',
    example: ['Coq au vin', 'Boeuf bourguignon', 'Crème brûlée'],
    type: [String],
    required: false,
  })
  specialties?: string[];

  @ApiProperty({
    description: 'Date de création du restaurant',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour du restaurant',
    example: '2024-02-20T14:45:00Z',
  })
  updatedAt: Date;
}
