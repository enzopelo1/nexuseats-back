import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'marco@nexus.dev',
  })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    description: 'Mot de passe (minimum 8 caractères)',
    example: 'secret123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password: string;
}
