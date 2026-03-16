import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger('NotificationsService');

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
      `Email envoyé : Commande #${data.orderId} confirmée pour ${data.customerEmail} (total: ${data.total})`,
    );
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @EventPattern('payment.confirmed')
  handlePaymentConfirmed(
    @Payload()
    data: {
      paymentId: string;
      orderId: string;
      amount: number;
      timestamp: string;
    },
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(
      `Email envoyé : Paiement #${data.paymentId} reçu pour la commande #${data.orderId} (montant: ${data.amount})`,
    );
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @EventPattern('order.delivered')
  handleOrderDelivered(
    @Payload()
    data: {
      orderId: string;
      customerEmail: string;
      deliveredAt: string;
    },
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(
      `Email envoyé : Commande #${data.orderId} livrée à ${data.customerEmail} (le ${data.deliveredAt})`,
    );
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}

