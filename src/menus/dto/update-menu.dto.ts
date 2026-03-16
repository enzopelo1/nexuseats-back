import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({
    description: 'Nom du menu',
    example: 'Menu Déjeuner Modifié',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description du menu',
    example: 'Notre nouvelle sélection pour le déjeuner',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
