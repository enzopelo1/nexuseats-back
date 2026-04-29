import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CurrentUser } from '../auth/current-user.decorator';

type GatewayOrder = {
  id: string;
  customerEmail?: string;
  status?: string;
  [key: string]: unknown;
};

@ApiTags('orders')
@ApiBearerAuth('JWT')
@Controller({ path: 'orders', version: '1' })
export class OrdersGatewayController {
  private readonly orderCache = new Map<string, GatewayOrder>();

  constructor(
    @Inject('ORDERS_SERVICE')
    private readonly ordersClient: ClientProxy,
  ) {}

  private async sendToOrders<T>(pattern: Record<string, string>, payload: unknown): Promise<T> {
    try {
      return await firstValueFrom(
        this.ordersClient.send<T>(pattern, payload).pipe(timeout(2000)),
      );
    } catch {
      throw new ServiceUnavailableException('Service Orders indisponible');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Créer une commande',
    description:
      'Crée une nouvelle commande via la Gateway HTTP, qui la transmet au microservice Orders via RabbitMQ.',
  })
  @ApiBody({
    description: 'Données de la commande à créer',
    schema: {
      example: {
        customerEmail: 'client@example.com',
        restaurantId: '2a9437ae-17a8-4872-93ff-30cc461f8518',
        items: [
          {
            menuItemId: 'item-1',
            quantity: 2,
            name: 'Plat du jour',
            unitPrice: 12.5,
          },
        ],
        total: 42.5,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Commande créée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides (payload incomplet ou mal formé)',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié (JWT manquant ou invalide)',
  })
  @ApiResponse({
    status: 503,
    description: 'Service Orders indisponible (timeout RabbitMQ)',
  })
  async createOrder(
    @Body()
    body: {
      customerEmail: string;
      restaurantId: string;
      items: {
        menuItemId: string;
        quantity: number;
        name?: string;
        unitPrice?: number;
      }[];
      total: number;
    },
  ) {
    const order = await this.sendToOrders<GatewayOrder>({ cmd: 'create_order' }, body);
    this.rememberOrder(order);
    return order;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Lister les commandes',
    description:
      'Admin / owner : toutes les commandes. Client : uniquement les commandes associées à son email.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des commandes récupérée avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié (JWT manquant ou invalide)',
  })
  async getOrders(
    @CurrentUser() user: { id: number; email: string; role: string },
  ) {
    let all: GatewayOrder[];
    try {
      all = await this.sendToOrders({ cmd: 'get_orders' }, {});
    } catch {
      all = [];
    }
    const merged = this.mergeCachedOrders(all);
    if (user.role === 'admin' || user.role === 'owner') {
      return merged;
    }
    return merged.filter(
      (o) =>
        (o.customerEmail || '').toLowerCase() === user.email.toLowerCase(),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Récupérer une commande par ID',
    description:
      'Retourne une commande spécifique à partir de son identifiant, via le microservice Orders.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant unique de la commande (UUID)',
    example: '8cd8e1c6-989a-4cf9-a122-c6f7552d04e9',
  })
  @ApiResponse({
    status: 200,
    description: 'Commande trouvée',
  })
  @ApiResponse({
    status: 404,
    description: 'Commande non trouvée',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié (JWT manquant ou invalide)',
  })
  async getOrderById(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; email: string; role: string },
  ) {
    const order = await this.sendToOrders<Record<string, unknown> | null>(
      { cmd: 'get_order_by_id' },
      id,
    );
    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }
    if (
      user.role !== 'admin' &&
      user.role !== 'owner' &&
      (order as { customerEmail?: string }).customerEmail?.toLowerCase() !==
        user.email.toLowerCase()
    ) {
      throw new NotFoundException('Commande non trouvée');
    }
    this.rememberOrder(order as GatewayOrder);
    return order;
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner')
  @ApiOperation({
    summary: 'Mettre à jour le statut d\'une commande',
    description:
      'Réservé aux rôles admin et owner (back-office). Met à jour le statut dans le microservice Orders.',
  })
  @ApiParam({ name: 'id', description: 'UUID de la commande' })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({ status: 200, description: 'Commande mise à jour' })
  @ApiResponse({ status: 404, description: 'Commande introuvable' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateOrderStatusDto,
  ) {
    let order = await this.sendToOrders<GatewayOrder | null>(
      { cmd: 'update_order_status' },
      { id, status: dto.status },
    );
    const cached = this.orderCache.get(id);
    if (!order && cached) {
      order = { ...cached, status: dto.status };
    }
    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }
    this.rememberOrder(order);
    return order;
  }

  private rememberOrder(order: GatewayOrder | null | undefined) {
    if (!order?.id) return;
    this.orderCache.set(String(order.id), { ...order, id: String(order.id) });
  }

  private mergeCachedOrders(orders: GatewayOrder[]) {
    const merged = new Map<string, GatewayOrder>();
    for (const order of orders) {
      if (order?.id) {
        merged.set(String(order.id), { ...order, id: String(order.id) });
      }
    }
    for (const [id, order] of this.orderCache) {
      merged.set(id, order);
    }
    return Array.from(merged.values());
  }
}

