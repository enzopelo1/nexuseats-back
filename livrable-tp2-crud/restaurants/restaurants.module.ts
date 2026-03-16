import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsV1Controller } from './restaurants-v1.controller';

@Module({
  controllers: [RestaurantsV1Controller],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
