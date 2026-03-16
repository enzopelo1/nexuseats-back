"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const analytics_module_1 = require("./analytics.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(analytics_module_1.AnalyticsModule, {
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: ['amqp://nexuseats:secret@localhost:5672'],
            queue: 'analytics_queue',
            queueOptions: {
                durable: true,
            },
        },
    });
    await app.listen();
    console.log('📊 Analytics Service démarré (queue: analytics_queue)');
}
bootstrap();
//# sourceMappingURL=main.js.map