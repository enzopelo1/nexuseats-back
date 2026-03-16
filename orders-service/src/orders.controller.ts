import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Order, OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'create_order' })
  handleCreateOrder(
    @Payload()
    payload: {
      customerEmail: string;
      restaurantId: string;
      items: { menuItemId: string; quantity: number }[];
      total: number;
    },
  ): Order {
    return this.ordersService.create(payload);
  }

  @MessagePattern({ cmd: 'get_orders' })
  handleGetOrders(): Order[] {
    return this.ordersService.findAll();
  }

  @MessagePattern({ cmd: 'get_order_by_id' })
  handleGetOrderById(@Payload() id: string): Order | null {
    return this.ordersService.findOne(id) ?? null;
  }
}

