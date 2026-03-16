import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches, IsISO31661Alpha2 } from 'class-validator';

export class AddressDto {
  @ApiProperty({
    description: 'Rue et numéro',
    example: '15 Rue de la Paix',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  street: string;

  @ApiProperty({
    description: 'Ville',
    example: 'Paris',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
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

