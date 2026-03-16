import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class AnalyticsController {
  private readonly logger = new Logger('AnalyticsService');

  @EventPattern('order.created')
  handleOrderCreated(
    @Payload()
    data: {
      orderId: string;
      customerEmail: string;
      items: any[];
      total: number;
      timestamp: string;
    },
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(
      `Analytics: commande #${data.orderId} pour ${data.customerEmail} (total: ${data.total})`,
    );
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}

