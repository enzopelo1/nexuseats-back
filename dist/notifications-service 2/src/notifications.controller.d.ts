import { RmqContext } from '@nestjs/microservices';
export declare class NotificationsController {
    private readonly logger;
    handleOrderCreated(data: {
        orderId: string;
        customerEmail: string;
        items: any[];
        total: number;
        timestamp: string;
    }, context: RmqContext): void;
    handlePaymentConfirmed(data: {
        paymentId: string;
        orderId: string;
        amount: number;
        timestamp: string;
    }, context: RmqContext): void;
    handleOrderDelivered(data: {
        orderId: string;
        customerEmail: string;
        deliveredAt: string;
    }, context: RmqContext): void;
}
