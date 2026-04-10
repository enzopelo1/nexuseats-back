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
exports.OrdersGatewayController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let OrdersGatewayController = class OrdersGatewayController {
    constructor(ordersClient) {
        this.ordersClient = ordersClient;
    }
    async createOrder(body) {
        return await (0, rxjs_1.firstValueFrom)(this.ordersClient.send({ cmd: 'create_order' }, body));
    }
    async getOrders(user) {
        const all = await (0, rxjs_1.firstValueFrom)(this.ordersClient.send({ cmd: 'get_orders' }, {}));
        if (user.role === 'admin' || user.role === 'owner') {
            return all;
        }
        return all.filter((o) => (o.customerEmail || '').toLowerCase() === user.email.toLowerCase());
    }
    async getOrderById(id, user) {
        const order = await (0, rxjs_1.firstValueFrom)(this.ordersClient.send({ cmd: 'get_order_by_id' }, id));
        if (!order) {
            throw new common_1.NotFoundException('Commande non trouvée');
        }
        if (user.role !== 'admin' &&
            user.role !== 'owner' &&
            order.customerEmail?.toLowerCase() !==
                user.email.toLowerCase()) {
            throw new common_1.NotFoundException('Commande non trouvée');
        }
        return order;
    }
    async updateOrderStatus(id, dto) {
        const order = await (0, rxjs_1.firstValueFrom)(this.ordersClient.send({ cmd: 'update_order_status' }, { id, status: dto.status }));
        if (!order) {
            throw new common_1.NotFoundException('Commande non trouvée');
        }
        return order;
    }
};
exports.OrdersGatewayController = OrdersGatewayController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer une commande',
        description: 'Crée une nouvelle commande via la Gateway HTTP, qui la transmet au microservice Orders via RabbitMQ.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Données de la commande à créer',
        schema: {
            example: {
                customerEmail: 'client@example.com',
                restaurantId: '2a9437ae-17a8-4872-93ff-30cc461f8518',
                items: [
                    {
                        menuItemId: 'item-1',
                        quantity: 2,
                        name: 'Plat du jour',
                        unitPrice: 12.5,
                    },
                ],
                total: 42.5,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Commande créée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Données invalides (payload incomplet ou mal formé)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Non authentifié (JWT manquant ou invalide)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'Service Orders indisponible (timeout RabbitMQ)',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Lister les commandes',
        description: 'Admin / owner : toutes les commandes. Client : uniquement les commandes associées à son email.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des commandes récupérée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Non authentifié (JWT manquant ou invalide)',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer une commande par ID',
        description: 'Retourne une commande spécifique à partir de son identifiant, via le microservice Orders.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Identifiant unique de la commande (UUID)',
        example: '8cd8e1c6-989a-4cf9-a122-c6f7552d04e9',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Commande trouvée',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Commande non trouvée',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Non authentifié (JWT manquant ou invalide)',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'owner'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mettre à jour le statut d\'une commande',
        description: 'Réservé aux rôles admin et owner (back-office). Met à jour le statut dans le microservice Orders.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de la commande' }),
    (0, swagger_1.ApiBody)({ type: update_order_status_dto_1.UpdateOrderStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Commande mise à jour' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Commande introuvable' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "updateOrderStatus", null);
exports.OrdersGatewayController = OrdersGatewayController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)({ path: 'orders', version: '1' }),
    __param(0, (0, common_2.Inject)('ORDERS_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], OrdersGatewayController);
//# sourceMappingURL=orders-gateway.controller.js.map