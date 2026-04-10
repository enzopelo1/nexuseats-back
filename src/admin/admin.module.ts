import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
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
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
