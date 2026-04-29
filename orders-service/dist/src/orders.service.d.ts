import { ClientProxy } from '@nestjs/microservices';
export interface OrderItem {
    menuItemId: string;
    quantity: number;
    name?: string;
    unitPrice?: number;
}
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
export interface Order {
    id: string;
    customerEmail: string;
    restaurantId: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: Date;
}
export declare class OrdersService {
    private readonly notificationsClient;
    private readonly analyticsClient;
    private orders;
    constructor(notificationsClient: ClientProxy, analyticsClient: ClientProxy);
    create(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order;
    findAll(): Order[];
    findOne(id: string): Order | undefined;
    updateStatus(id: string, status: OrderStatus): Order | null;
}
