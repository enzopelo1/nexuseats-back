import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AnalyticsModule } from './analytics.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AnalyticsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://nexuseats:secret@localhost:5672'],
        queue: 'analytics_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
  // eslint-disable-next-line no-console
  console.log('📊 Analytics Service démarré (queue: analytics_queue)');
}

bootstrap();

