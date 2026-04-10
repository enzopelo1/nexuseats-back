import { AdminService } from './admin.service';
declare const ROLES_DB: readonly ["customer", "owner", "admin"];
declare class UpdateRoleDto {
    role: (typeof ROLES_DB)[number];
}
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    users(): Promise<{
        id: number;
        email: string;
        role: string;
        createdAt: Date;
    }[]>;
    patchRole(id: number, dto: UpdateRoleDto): Promise<{
        id: number;
        email: string;
        role: string;
        createdAt: Date;
    }>;
    dashboard(): Promise<{
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
    overview(): Promise<{
        monthly: {
            month: string;
            revenue: number;
        }[];
        topDishes: {
            name: string;
            count: number;
        }[];
    }>;
    exportCsv(): string;
}
export {};
