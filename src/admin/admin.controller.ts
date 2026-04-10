import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  ValidationPipe,
  Header,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { AdminService } from './admin.service';
import { SkipTransform } from '../common/decorators/skip-transform.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

const ROLES_DB = ['customer', 'owner', 'admin'] as const;

class UpdateRoleDto {
  @IsString()
  @IsIn([...ROLES_DB])
  role: (typeof ROLES_DB)[number];
}

@ApiTags('admin')
@ApiBearerAuth('JWT')
@Controller({ path: 'admin', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Lister les utilisateurs (admin)' })
  async users() {
    return this.adminService.listUsers();
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Mettre à jour le rôle (admin)' })
  async patchRole(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateRoleDto,
  ) {
    return this.adminService.updateUserRole(id, dto.role);
  }

  @Get('stats/dashboard')
  @ApiOperation({ summary: 'Indicateurs pour le tableau de bord back-office' })
  async dashboard() {
    return this.adminService.dashboardStats();
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Vue statistiques (graphiques)' })
  async overview() {
    return this.adminService.statsOverview();
  }

  @Get('stats/export')
  @SkipTransform()
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header(
    'Content-Disposition',
    'attachment; filename="nexuseats-stats.csv"',
  )
  @ApiOperation({ summary: 'Export CSV minimal' })
  @ApiResponse({ status: 200, description: 'Fichier CSV' })
  exportCsv() {
    return this.adminService.buildStatsCsv();
  }
}
