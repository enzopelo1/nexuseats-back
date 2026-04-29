import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches, IsISO31661Alpha2 } from 'class-validator';

export class AddressDto {
  @ApiProperty({
    description: 'Rue et numéro',
    example: '15 Rue de la Paix',
    maxLength: 120,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(120, { message: 'La rue ne doit pas dépasser 120 caractères' })
  street: string;

  @ApiProperty({
    description: 'Ville',
    example: 'Paris',
    maxLength: 60,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(60, { message: 'La ville ne doit pas dépasser 60 caractères' })
  city: string;

  @ApiProperty({
    description: 'Code postal (5 chiffres)',
    example: '75002',
    pattern: '^\\d{5}$',
  })
  @Matches(/^\d{5}$/, { message: 'Le code postal doit contenir exactement 5 chiffres' })
  zipCode: string;

  @ApiProperty({
    description: 'Code pays ISO 3166-1 alpha-2',
    example: 'FR',
  })
  @IsISO31661Alpha2()
  country: string;
}

