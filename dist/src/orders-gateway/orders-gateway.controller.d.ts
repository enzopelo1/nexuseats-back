import { ClientProxy } from '@nestjs/microservices';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersGatewayController {
    private readonly ordersClient;
    constructor(ordersClient: ClientProxy);
    createOrder(body: {
        customerEmail: string;
        restaurantId: string;
        items: {
            menuItemId: string;
            quantity: number;
            name?: string;
            unitPrice?: number;
        }[];
        total: number;
    }): Promise<any>;
    getOrders(user: {
        id: number;
        email: string;
        role: string;
    }): Promise<any>;
    getOrderById(id: string, user: {
        id: number;
        email: string;
        role: string;
    }): Promise<any>;
    updateOrderStatus(id: string, dto: UpdateOrderStatusDto): Promise<any>;
}
