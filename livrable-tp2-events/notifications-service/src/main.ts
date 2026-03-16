import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://nexuseats:secret@localhost:5672'],
        queue: 'notifications_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
  // eslint-disable-next-line no-console
  console.log('📨 Notifications Service démarré (queue: notifications_queue)');
}

bootstrap();

