import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersGatewayController } from './orders-gateway.controller';
import { AuthModule } from '../auth/auth.module';

const rabbitUrl =
  process.env.RABBITMQ_URL || 'amqp://nexuseats:secret@localhost:5672';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitUrl],
          queue: 'orders_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [OrdersGatewayController],
})
export class OrdersGatewayModule {}

