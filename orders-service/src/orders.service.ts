import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface OrderItem {
  menuItemId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  restaurantId: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
}

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  constructor(
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
    @Inject('ANALYTICS_SERVICE')
    private readonly analyticsClient: ClientProxy,
  ) {}

  create(order: Omit<Order, 'id' | 'createdAt'>): Order {
    const id = crypto.randomUUID();
    const newOrder: Order = {
      id,
      createdAt: new Date(),
      ...order,
    };
    this.orders.push(newOrder);

    const payload = {
      orderId: newOrder.id,
      customerEmail: newOrder.customerEmail,
      items: newOrder.items,
      total: newOrder.total,
      timestamp: new Date().toISOString(),
    };

    // Log local pour vérifier l'émission de l'événement
    // (utile pour tes captures et le debug)
    // eslint-disable-next-line no-console
    console.log('Emitting order.created for', payload.orderId);

    // Événement pour Notifications
    this.notificationsClient.emit('order.created', payload);

    // Événement pour Analytics (fanout simulé vers un autre service)
    this.analyticsClient.emit('order.created', payload);

    return newOrder;
  }

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }
}

