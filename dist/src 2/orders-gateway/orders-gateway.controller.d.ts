import { ClientProxy } from '@nestjs/microservices';
export declare class OrdersGatewayController {
    private readonly ordersClient;
    constructor(ordersClient: ClientProxy);
    createOrder(body: {
        customerEmail: string;
        restaurantId: string;
        items: {
            menuItemId: string;
            quantity: number;
        }[];
        total: number;
    }): Promise<any>;
    getOrders(): Promise<any>;
    getOrderById(id: string): Promise<any>;
}
