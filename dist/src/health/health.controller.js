"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const net = __importStar(require("net"));
const prisma_service_1 = require("../prisma/prisma.service");
function parseAmqpHostPort(urlStr) {
    try {
        const normalized = urlStr.replace(/^amqp\+?s?:\/\//i, 'http://');
        const u = new URL(normalized);
        return {
            host: u.hostname || 'localhost',
            port: u.port ? Number(u.port) : 5672,
        };
    }
    catch {
        return { host: 'localhost', port: 5672 };
    }
}
function tcpReachable(host, port, ms = 2000) {
    return new Promise((resolve) => {
        const socket = net.connect({ host, port });
        const done = (ok) => {
            socket.removeAllListeners();
            socket.destroy();
            resolve(ok);
        };
        socket.setTimeout(ms);
        socket.on('connect', () => done(true));
        socket.on('error', () => done(false));
        socket.on('timeout', () => done(false));
    });
}
let HealthController = class HealthController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async check() {
        let database = 'down';
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            database = 'up';
        }
        catch {
            database = 'down';
        }
        const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://nexuseats:secret@localhost:5672';
        const { host, port } = parseAmqpHostPort(rabbitUrl);
        const rabbitUp = await tcpReachable(host, port);
        const allUp = database === 'up' && rabbitUp;
        return {
            status: allUp ? 'ok' : 'degraded',
            services: {
                api: { status: 'up' },
                database: { status: database === 'up' ? 'up' : 'down' },
                rabbitmq: { status: rabbitUp ? 'up' : 'down' },
            },
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, throttler_1.SkipThrottle)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)({ path: 'health', version: common_1.VERSION_NEUTRAL }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map