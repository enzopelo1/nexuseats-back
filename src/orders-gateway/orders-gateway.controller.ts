import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth('JWT')
@Controller({ path: 'orders', version: '1' })
export class OrdersGatewayController {
  constructor(
    @Inject('ORDERS_SERVICE')
    private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
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
        items: [{ menuItemId: 'item-1', quantity: 2 }],
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
      items: { menuItemId: string; quantity: number }[];
      total: number;
    },
  ) {
    return await firstValueFrom(
      this.ordersClient.send({ cmd: 'create_order' }, body),
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les commandes',
    description:
      'Retourne la liste de toutes les commandes depuis le microservice Orders.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des commandes récupérée avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié (JWT manquant ou invalide)',
  })
  async getOrders() {
    return await firstValueFrom(
      this.ordersClient.send({ cmd: 'get_orders' }, {}),
    );
  }

  @Get(':id')
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
  async getOrderById(@Param('id') id: string) {
    return await firstValueFrom(
      this.ordersClient.send({ cmd: 'get_order_by_id' }, id),
    );
  }
}

