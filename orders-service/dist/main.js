"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const orders_module_1 = require("./orders.module");
async function bootstrap() {
    console.log('Orders Service: bootstrap start');
    const app = await core_1.NestFactory.createMicroservice(orders_module_1.OrdersModule, {
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://nexuseats:secret@localhost:5672'],
            queue: 'orders_queue',
            queueOptions: {
                durable: true,
            },
        },
    });
    console.log('Orders Service: Nest microservice created');
    await app.listen();
    console.log('📦 Orders Service microservice RMQ démarré (queue: orders_queue)');
}
bootstrap().catch((error) => {
    console.error('Orders Service bootstrap failed:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map