"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersGatewayModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const orders_gateway_controller_1 = require("./orders-gateway.controller");
let OrdersGatewayModule = class OrdersGatewayModule {
};
exports.OrdersGatewayModule = OrdersGatewayModule;
exports.OrdersGatewayModule = OrdersGatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'ORDERS_SERVICE',
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: ['amqp://nexuseats:secret@localhost:5672'],
                        queue: 'orders_queue',
                        queueOptions: {
                            durable: true,
                        },
                    },
                },
            ]),
        ],
        controllers: [orders_gateway_controller_1.OrdersGatewayController],
    })
], OrdersGatewayModule);
//# sourceMappingURL=orders-gateway.module.js.map