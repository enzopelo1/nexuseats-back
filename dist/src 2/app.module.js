"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const restaurants_module_1 = require("./restaurants/restaurants.module");
const restaurants_v2_module_1 = require("./restaurants/v2/restaurants-v2.module");
const menus_module_1 = require("./menus/menus.module");
const menu_items_module_1 = require("./menu-items/menu-items.module");
const auth_module_1 = require("./auth/auth.module");
const common_module_1 = require("./common/common.module");
const health_controller_1 = require("./health/health.controller");
const orders_gateway_module_1 = require("./orders-gateway/orders-gateway.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 1000,
                    limit: 10,
                },
                {
                    name: 'medium',
                    ttl: 60_000,
                    limit: 100,
                },
                {
                    name: 'long',
                    ttl: 3_600_000,
                    limit: 1000,
                },
            ]),
            prisma_module_1.PrismaModule,
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            restaurants_module_1.RestaurantsModule,
            restaurants_v2_module_1.RestaurantsV2Module,
            menus_module_1.MenusModule,
            menu_items_module_1.MenuItemsModule,
            orders_gateway_module_1.OrdersGatewayModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map