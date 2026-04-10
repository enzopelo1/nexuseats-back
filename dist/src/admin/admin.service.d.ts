import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
export declare class AdminService {
    private readonly prisma;
    private readonly ordersClient;
    constructor(prisma: PrismaService, ordersClient: ClientProxy);
    listUsers(): Promise<{
        id: number;
        email: string;
        role: string;
        createdAt: Date;
    }[]>;
    updateUserRole(id: number, role: string): Promise<{
        id: number;
        email: string;
        role: string;
        createdAt: Date;
    }>;
    dashboardStats(): Promise<{
        totalRestaurants: number;
        totalOrders: number;
        totalUsers: number;
        totalRevenue: number;
        revenueToday: number;
        revenueByDay: {
            date: string;
            revenue: number;
        }[];
        ordersByStatus: {
            status: string;
            count: number;
        }[];
        recentOrders: {
            id: string;
            status: string;
            totalAmount: number;
            createdAt: string;
            restaurant: {
                name: string;
            };
        }[];
        totalMenus: number;
        totalMenuItems: number;
    }>;
    statsOverview(): Promise<{
        monthly: {
            month: string;
            revenue: number;
        }[];
        topDishes: {
            name: string;
            count: number;
        }[];
    }>;
    buildStatsCsv(): string;
}
