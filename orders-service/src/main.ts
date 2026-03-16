import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrdersModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://nexuseats:secret@localhost:5672'],
        queue: 'orders_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
  // eslint-disable-next-line no-console
  console.log('📦 Orders Service microservice RMQ démarré (queue: orders_queue)');
}

bootstrap();

