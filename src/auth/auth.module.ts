import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { SignOptions } from 'jsonwebtoken';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

/** Durée JWT : nombre (secondes) ou chaîne reconnue par jsonwebtoken / ms (ex. 1d, 7d, 12h). */
function jwtExpiresIn(): NonNullable<SignOptions['expiresIn']> {
  const raw = process.env.JWT_EXPIRES_IN?.trim();
  if (!raw) return 86_400;
  if (/^\d+$/.test(raw)) return parseInt(raw, 10);
  return raw as NonNullable<SignOptions['expiresIn']>;
}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'nexuseats-super-secret-key-change-in-production',
      signOptions: {
        expiresIn: jwtExpiresIn(),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
