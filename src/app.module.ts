import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RestaurantsV2Module } from './restaurants/v2/restaurants-v2.module';
import { MenusModule } from './menus/menus.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { HealthController } from './health/health.controller';
import { OrdersGatewayModule } from './orders-gateway/orders-gateway.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 seconde
        limit: 10, // 10 requêtes / seconde
      },
      {
        name: 'medium',
        ttl: 60_000, // 1 minute
        limit: 100, // 100 requêtes / minute
      },
      {
        name: 'long',
        ttl: 3_600_000, // 1 heure
        limit: 1000, // 1000 requêtes / heure
      },
    ]),
    PrismaModule,
    CommonModule,
    AuthModule,
    RestaurantsModule,
    RestaurantsV2Module,
    MenusModule,
    MenuItemsModule,
    OrdersGatewayModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
