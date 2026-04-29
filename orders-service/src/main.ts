import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  console.log('Orders Service: bootstrap start');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrdersModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://nexuseats:secret@localhost:5672'],
        queue: 'orders_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  console.log('Orders Service: Nest microservice created');
  await app.listen();
  // eslint-disable-next-line no-console
  console.log('📦 Orders Service microservice RMQ démarré (queue: orders_queue)');
}

bootstrap().catch((error) => {
  console.error('Orders Service bootstrap failed:', error);
  process.exit(1);
});

