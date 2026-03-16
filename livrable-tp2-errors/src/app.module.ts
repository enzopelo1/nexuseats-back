import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RestaurantsV2Module } from './restaurants/v2/restaurants-v2.module';
import { MenusModule } from './menus/menus.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    PrismaModule,
    CommonModule,
    AuthModule,
    RestaurantsModule,
    RestaurantsV2Module,
    MenusModule,
    MenuItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
