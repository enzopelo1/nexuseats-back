import { Module } from '@nestjs/common';
import { RestaurantsV2Service } from './restaurants-v2.service';
import { RestaurantsV2Controller } from './restaurants-v2.controller';

@Module({
  controllers: [RestaurantsV2Controller],
  providers: [RestaurantsV2Service],
  exports: [RestaurantsV2Service],
})
export class RestaurantsV2Module {}
