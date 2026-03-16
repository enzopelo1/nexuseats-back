import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsUUID, IsArray, Min } from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({
    description: 'Nom de l\'item',
    example: 'Pizza Margherita',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description de l\'item',
    example: 'Pizza traditionnelle avec tomate, mozzarella et basilic',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Prix de l\'item en euros',
    example: 12.50,
    required: true,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'URL de l\'image de l\'item',
    example: 'https://example.com/images/pizza.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Disponibilité de l\'item',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @ApiProperty({
    description: 'ID du menu',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  menuId: string;

  @ApiProperty({
    description: 'IDs des catégories à associer',
    example: ['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  categoryIds?: string[];
}
