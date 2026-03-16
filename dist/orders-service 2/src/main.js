"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const orders_module_1 = require("./orders.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(orders_module_1.OrdersModule, {
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: ['amqp://nexuseats:secret@localhost:5672'],
            queue: 'orders_queue',
            queueOptions: {
                durable: true,
            },
        },
    });
    await app.listen();
    console.log('📦 Orders Service microservice RMQ démarré (queue: orders_queue)');
}
bootstrap();
//# sourceMappingURL=main.js.map