import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMenuItemDto } from './create-menu-item.dto';
import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsUUID, Min } from 'class-validator';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {
  @ApiProperty({
    description: 'Nom de l\'item',
    example: 'Pizza Margherita Deluxe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description de l\'item',
    example: 'Pizza traditionnelle améliorée',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Prix de l\'item en euros',
    example: 14.50,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiProperty({
    description: 'URL de l\'image de l\'item',
    example: 'https://example.com/images/pizza-deluxe.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Disponibilité de l\'item',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @ApiProperty({
    description: 'IDs des catégories à associer (remplace toutes les catégories existantes)',
    example: ['550e8400-e29b-41d4-a716-446655440001'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  categoryIds?: string[];
}
