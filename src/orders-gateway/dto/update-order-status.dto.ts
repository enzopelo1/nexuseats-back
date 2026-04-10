import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

const ORDER_STATUSES = [
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'READY',
  'DELIVERED',
  'CANCELLED',
] as const;

export type OrderStatusDto = (typeof ORDER_STATUSES)[number];

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: ORDER_STATUSES,
    example: 'PREPARING',
  })
  @IsString()
  @IsIn([...ORDER_STATUSES])
  status: OrderStatusDto;
}
