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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const admin_service_1 = require("./admin.service");
const skip_transform_decorator_1 = require("../common/decorators/skip-transform.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const ROLES_DB = ['customer', 'owner', 'admin'];
class UpdateRoleDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)([...ROLES_DB]),
    __metadata("design:type", Object)
], UpdateRoleDto.prototype, "role", void 0);
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async users() {
        return this.adminService.listUsers();
    }
    async patchRole(id, dto) {
        return this.adminService.updateUserRole(id, dto.role);
    }
    async dashboard() {
        return this.adminService.dashboardStats();
    }
    async overview() {
        return this.adminService.statsOverview();
    }
    exportCsv() {
        return this.adminService.buildStatsCsv();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les utilisateurs (admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "users", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le rôle (admin)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "patchRole", null);
__decorate([
    (0, common_1.Get)('stats/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Indicateurs pour le tableau de bord back-office' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Vue statistiques (graphiques)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)('stats/export'),
    (0, skip_transform_decorator_1.SkipTransform)(),
    (0, common_1.Header)('Content-Type', 'text/csv; charset=utf-8'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="nexuseats-stats.csv"'),
    (0, swagger_1.ApiOperation)({ summary: 'Export CSV minimal' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fichier CSV' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "exportCsv", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)({ path: 'admin', version: '1' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map