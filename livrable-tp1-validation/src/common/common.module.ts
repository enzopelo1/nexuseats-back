import { Module } from '@nestjs/common';
import { IsUniqueRestaurantNameConstraint } from './validators/is-unique-restaurant-name.validator';

@Module({
  providers: [IsUniqueRestaurantNameConstraint],
  exports: [IsUniqueRestaurantNameConstraint],
})
export class CommonModule {}

