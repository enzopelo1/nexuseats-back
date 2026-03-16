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
export declare class OrdersService {
    private readonly notificationsClient;
    private readonly analyticsClient;
    private orders;
    constructor(notificationsClient: ClientProxy, analyticsClient: ClientProxy);
    create(order: Omit<Order, 'id' | 'createdAt'>): Order;
    findAll(): Order[];
    findOne(id: string): Order | undefined;
}
