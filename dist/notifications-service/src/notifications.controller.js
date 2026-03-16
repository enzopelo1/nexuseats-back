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
exports.NotificationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let NotificationsController = class NotificationsController {
    constructor() {
        this.logger = new common_1.Logger('NotificationsService');
    }
    handleOrderCreated(data, context) {
        this.logger.log(`Email envoyé : Commande #${data.orderId} confirmée pour ${data.customerEmail} (total: ${data.total})`);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        channel.ack(originalMsg);
    }
    handlePaymentConfirmed(data, context) {
        this.logger.log(`Email envoyé : Paiement #${data.paymentId} reçu pour la commande #${data.orderId} (montant: ${data.amount})`);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        channel.ack(originalMsg);
    }
    handleOrderDelivered(data, context) {
        this.logger.log(`Email envoyé : Commande #${data.orderId} livrée à ${data.customerEmail} (le ${data.deliveredAt})`);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        channel.ack(originalMsg);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, microservices_1.EventPattern)('order.created'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.RmqContext]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "handleOrderCreated", null);
__decorate([
    (0, microservices_1.EventPattern)('payment.confirmed'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.RmqContext]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "handlePaymentConfirmed", null);
__decorate([
    (0, microservices_1.EventPattern)('order.delivered'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.RmqContext]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "handleOrderDelivered", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)()
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map