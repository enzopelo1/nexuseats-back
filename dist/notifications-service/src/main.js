"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const notifications_module_1 = require("./notifications.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(notifications_module_1.NotificationsModule, {
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: ['amqp://nexuseats:secret@localhost:5672'],
            queue: 'notifications_queue',
            queueOptions: {
                durable: true,
            },
        },
    });
    await app.listen();
    console.log('📨 Notifications Service démarré (queue: notifications_queue)');
}
bootstrap();
//# sourceMappingURL=main.js.map