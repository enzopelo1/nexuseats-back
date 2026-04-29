import { ClientProxy } from '@nestjs/microservices';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
type GatewayOrder = {
    id: string;
    customerEmail?: string;
    status?: string;
    [key: string]: unknown;
};
export declare class OrdersGatewayController {
    private readonly ordersClient;
    private readonly orderCache;
    constructor(ordersClient: ClientProxy);
    private sendToOrders;
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
    }): Promise<GatewayOrder>;
    getOrders(user: {
        id: number;
        email: string;
        role: string;
    }): Promise<GatewayOrder[]>;
    getOrderById(id: string, user: {
        id: number;
        email: string;
        role: string;
    }): Promise<Record<string, unknown>>;
    updateOrderStatus(id: string, dto: UpdateOrderStatusDto): Promise<GatewayOrder>;
    private rememberOrder;
    private mergeCachedOrders;
}
export {};
