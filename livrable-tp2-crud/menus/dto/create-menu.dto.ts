import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({
    description: 'Nom du menu',
    example: 'Menu Déjeuner',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description du menu',
    example: 'Notre sélection pour le déjeuner',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID du restaurant',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  restaurantId: string;
}
