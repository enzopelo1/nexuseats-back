"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let OrdersService = class OrdersService {
    constructor(notificationsClient, analyticsClient) {
        this.notificationsClient = notificationsClient;
        this.analyticsClient = analyticsClient;
        this.orders = [];
    }
    create(order) {
        const id = crypto.randomUUID();
        const newOrder = {
            id,
            createdAt: new Date(),
            ...order,
        };
        this.orders.push(newOrder);
        const payload = {
            orderId: newOrder.id,
            customerEmail: newOrder.customerEmail,
            items: newOrder.items,
            total: newOrder.total,
            timestamp: new Date().toISOString(),
        };
        console.log('Emitting order.created for', payload.orderId);
        this.notificationsClient.emit('order.created', payload);
        this.analyticsClient.emit('order.created', payload);
        return newOrder;
    }
    findAll() {
        return this.orders;
    }
    findOne(id) {
        return this.orders.find((o) => o.id === id);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('NOTIFICATIONS_SERVICE')),
    __param(1, (0, common_1.Inject)('ANALYTICS_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        microservices_1.ClientProxy])
], OrdersService);
//# sourceMappingURL=orders.service.js.map