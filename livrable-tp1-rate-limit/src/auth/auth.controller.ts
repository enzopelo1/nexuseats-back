import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { Throttle, SkipThrottle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Inscription',
    description: 'Crée un compte utilisateur et retourne un JWT',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Compte créé, JWT retourné',
    schema: { example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } },
  })
  @ApiResponse({
    status: 409,
    description: 'Un compte existe déjà avec cet email',
    schema: { example: { statusCode: 409, message: 'Un compte existe déjà avec cet email', error: 'Conflict' } },
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides (email ou mot de passe trop court)',
  })
  async register(@Body(ValidationPipe) dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Throttle({ short: { limit: 3, ttl: 1000 } })
  @ApiOperation({
    summary: 'Connexion',
    description: 'Authentification par email/mot de passe, retourne un JWT',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Connexion réussie, JWT retourné',
    schema: { example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } },
  })
  @ApiResponse({
    status: 401,
    description: 'Email ou mot de passe incorrect',
    schema: { example: { statusCode: 401, message: 'Email ou mot de passe incorrect', error: 'Unauthorized' } },
  })
  async login(@Body(ValidationPipe) dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Profil utilisateur',
    description: 'Retourne les infos de l\'utilisateur connecté (route protégée)',
  })
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur',
    schema: { example: { id: 1, email: 'marco@nexus.dev', role: 'customer' } },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié ou token invalide',
  })
  getProfile(@CurrentUser() user: { id: number; email: string; role: string }) {
    return user;
  }
}
