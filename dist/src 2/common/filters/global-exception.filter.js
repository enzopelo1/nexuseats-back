"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const timestamp = new Date().toISOString();
        const requestId = request.requestId;
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            }
            else {
                message = res.message ?? message;
                error = res.error ?? error;
            }
        }
        else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (exception.code === 'P2002') {
                status = common_1.HttpStatus.CONFLICT;
                error = 'Conflict';
                const target = exception.meta?.target?.join(', ') ?? 'champ';
                message = `Un enregistrement avec cette valeur de ${target} existe déjà`;
            }
            else if (exception.code === 'P2025') {
                status = common_1.HttpStatus.NOT_FOUND;
                error = 'Not Found';
                message = 'Enregistrement non trouvé';
            }
            else if (exception.code === 'P2003') {
                status = common_1.HttpStatus.BAD_REQUEST;
                error = 'Bad Request';
                message = 'Référence invalide';
            }
        }
        if (process.env.NODE_ENV !== 'production') {
            console.error('GlobalExceptionFilter:', exception);
        }
        response.status(status).json({
            success: false,
            error: {
                statusCode: status,
                message,
                error,
                timestamp,
                path: request.url,
                requestId,
            },
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map