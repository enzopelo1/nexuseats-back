import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ORDERS_SERVICE')
    private readonly ordersClient: ClientProxy,
  ) {}

  async listUsers() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, email: true, role: true, createdAt: true },
    });
  }

  async updateUserRole(id: number, role: string) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, email: true, role: true, createdAt: true },
      });
    } catch {
      throw new NotFoundException('Utilisateur introuvable');
    }
  }

  async dashboardStats() {
    const [totalRestaurants, totalUsers, totalMenus, totalMenuItems] =
      await Promise.all([
        this.prisma.restaurant.count({ where: { deletedAt: null } }),
        this.prisma.user.count(),
        this.prisma.menu.count(),
        this.prisma.menuItem.count(),
      ]);

    type NormalizedOrder = {
      id: string;
      restaurantId: string;
      total: number;
      status: string;
      createdAt: Date;
    };

    let orders: NormalizedOrder[] = [];
    try {
      const raw = await firstValueFrom(
        this.ordersClient.send({ cmd: 'get_orders' }, {}).pipe(timeout(1500)),
      );
      if (Array.isArray(raw)) {
        orders = raw.map((o: Record<string, unknown>) => ({
          id: String(o.id),
          restaurantId: String(o.restaurantId ?? ''),
          total: Number(o.total ?? 0),
          status: String(o.status ?? 'PENDING'),
          createdAt:
            o.createdAt instanceof Date
              ? o.createdAt
              : new Date(String(o.createdAt ?? Date.now())),
        }));
      }
    } catch {
      orders = [];
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const revenueToday = orders
      .filter((o) => o.createdAt >= startOfToday)
      .reduce((s, o) => s + o.total, 0);

    const statusMap = new Map<string, number>();
    for (const o of orders) {
      statusMap.set(o.status, (statusMap.get(o.status) || 0) + 1);
    }
    const ordersByStatus = Array.from(statusMap.entries()).map(
      ([status, count]) => ({ status, count }),
    );

    const revenueByDayMap = new Map<string, number>();
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

    const sorted = [...orders].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
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

  buildStatsCsv(): string {
    const header = 'metric,value\n';
    return `${header}note,Données analytiques complètes non disponibles sans stockage des ventes\n`;
  }
}
