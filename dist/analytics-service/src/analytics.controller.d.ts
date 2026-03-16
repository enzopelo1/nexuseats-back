import { RmqContext } from '@nestjs/microservices';
export declare class AnalyticsController {
    private readonly logger;
    handleOrderCreated(data: {
        orderId: string;
        customerEmail: string;
        items: any[];
        total: number;
        timestamp: string;
    }, context: RmqContext): void;
}
