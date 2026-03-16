import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

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

  @ApiProperty({
    description: 'Rôle de l\'utilisateur (pour démo / tests TP)',
    example: 'owner',
    enum: ['customer', 'owner', 'admin'],
    required: false,
  })
  @IsOptional()
  @IsIn(['customer', 'owner', 'admin'], { message: 'Rôle invalide' })
  role?: 'customer' | 'owner' | 'admin';
}
