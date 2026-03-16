import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Adresse email',
    example: 'marco@nexus.dev',
  })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'secret123',
  })
  @IsString()
  @MinLength(1, { message: 'Le mot de passe est requis' })
  password: string;
}
