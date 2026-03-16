import { Order, OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    handleCreateOrder(payload: {
        customerEmail: string;
        restaurantId: string;
        items: {
            menuItemId: string;
            quantity: number;
        }[];
        total: number;
    }): Order;
    handleGetOrders(): Order[];
    handleGetOrderById(id: string): Order | null;
}
