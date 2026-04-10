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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const common_2 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let AdminService = class AdminService {
    constructor(prisma, ordersClient) {
        this.prisma = prisma;
        this.ordersClient = ordersClient;
    }
    async listUsers() {
        return this.prisma.user.findMany({
            orderBy: { id: 'asc' },
            select: { id: true, email: true, role: true, createdAt: true },
        });
    }
    async updateUserRole(id, role) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: { role },
                select: { id: true, email: true, role: true, createdAt: true },
            });
        }
        catch {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
    }
    async dashboardStats() {
        const [totalRestaurants, totalUsers, totalMenus, totalMenuItems] = await Promise.all([
            this.prisma.restaurant.count({ where: { deletedAt: null } }),
            this.prisma.user.count(),
            this.prisma.menu.count(),
            this.prisma.menuItem.count(),
        ]);
        let orders = [];
        try {
            const raw = await (0, rxjs_1.firstValueFrom)(this.ordersClient.send({ cmd: 'get_orders' }, {}));
            if (Array.isArray(raw)) {
                orders = raw.map((o) => ({
                    id: String(o.id),
                    restaurantId: String(o.restaurantId ?? ''),
                    total: Number(o.total ?? 0),
                    status: String(o.status ?? 'PENDING'),
                    createdAt: o.createdAt instanceof Date
                        ? o.createdAt
                        : new Date(String(o.createdAt ?? Date.now())),
                }));
            }
        }
        catch {
            orders = [];
        }
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const revenueToday = orders
            .filter((o) => o.createdAt >= startOfToday)
            .reduce((s, o) => s + o.total, 0);
        const statusMap = new Map();
        for (const o of orders) {
            statusMap.set(o.status, (statusMap.get(o.status) || 0) + 1);
        }
        const ordersByStatus = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));
        const revenueByDayMap = new Map();
        for (const o of orders) {
            const key = o.createdAt.toISOString().slice(0, 10);
            revenueByDayMap.set(key, (revenueByDayMap.get(key) || 0) + o.total);
        }
        const revenueByDay = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            d.setHours(0, 0, 0, 0);
            const key = d.toISOString().slice(0, 10);
            return {
                date: key,
                revenue: revenueByDayMap.get(key) || 0,
            };
        });
        const sorted = [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const recentSlice = sorted.slice(0, 20);
        const restaurantIds = [...new Set(recentSlice.map((o) => o.restaurantId))];
        const restaurants = await this.prisma.restaurant.findMany({
            where: { id: { in: restaurantIds } },
            select: { id: true, name: true },
        });
        const nameById = new Map(restaurants.map((r) => [r.id, r.name]));
        const recentOrders = recentSlice.map((o) => ({
            id: o.id,
            status: o.status,
            totalAmount: o.total,
            createdAt: o.createdAt.toISOString(),
            restaurant: {
                name: nameById.get(o.restaurantId) || o.restaurantId.slice(0, 8),
            },
        }));
        return {
            totalRestaurants,
            totalOrders,
            totalUsers,
            totalRevenue,
            revenueToday,
            revenueByDay,
            ordersByStatus,
            recentOrders,
            totalMenus,
            totalMenuItems,
        };
    }
    async statsOverview() {
        const topItems = await this.prisma.menuItem.findMany({
            take: 10,
            orderBy: { name: 'asc' },
            select: { name: true, id: true },
        });
        const monthly = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return {
                month: d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
                revenue: 0,
            };
        });
        return {
            monthly,
            topDishes: topItems.map((it) => ({ name: it.name, count: 0 })),
        };
    }
    buildStatsCsv() {
        const header = 'metric,value\n';
        return `${header}note,Données analytiques complètes non disponibles sans stockage des ventes\n`;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_2.Inject)('ORDERS_SERVICE')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        microservices_1.ClientProxy])
], AdminService);
//# sourceMappingURL=admin.service.js.map