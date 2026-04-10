import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        services: {
            api: {
                status: "up";
            };
            database: {
                status: "up" | "down";
            };
            rabbitmq: {
                status: "up" | "down";
            };
        };
    }>;
}
