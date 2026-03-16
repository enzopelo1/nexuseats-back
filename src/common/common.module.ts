import { Module } from '@nestjs/common';
import { IsUniqueRestaurantNameConstraint } from './validators/is-unique-restaurant-name.validator';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  providers: [
    IsUniqueRestaurantNameConstraint,
    GlobalExceptionFilter,
    TransformInterceptor,
    LoggingInterceptor,
  ],
  exports: [
    IsUniqueRestaurantNameConstraint,
    GlobalExceptionFilter,
    TransformInterceptor,
    LoggingInterceptor,
  ],
})
export class CommonModule {}

