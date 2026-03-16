import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    // Vérifier que le restaurant existe
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        id: createMenuDto.restaurantId,
        deletedAt: null,
      },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${createMenuDto.restaurantId} non trouvé`);
    }

    return await this.prisma.menu.create({
      data: {
        name: createMenuDto.name,
        description: createMenuDto.description,
        restaurantId: createMenuDto.restaurantId,
      },
      include: {
        restaurant: true,
        items: true,
      },
    });
  }

  async findAllByRestaurant(restaurantId: string) {
    // Vérifier que le restaurant existe
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        id: restaurantId,
        deletedAt: null,
      },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${restaurantId} non trouvé`);
    }

    return await this.prisma.menu.findMany({
      where: {
        restaurantId,
      },
      include: {
        items: {
          include: {
            categories: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: {
        restaurant: true,
        items: {
          include: {
            categories: true,
          },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu avec l'ID ${id} non trouvé`);
    }

    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    // Vérifier que le menu existe
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu avec l'ID ${id} non trouvé`);
    }

    return await this.prisma.menu.update({
      where: { id },
      data: {
        ...(updateMenuDto.name && { name: updateMenuDto.name }),
        ...(updateMenuDto.description !== undefined && { description: updateMenuDto.description }),
      },
      include: {
        restaurant: true,
        items: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    // Vérifier que le menu existe
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu avec l'ID ${id} non trouvé`);
    }

    // Supprimer le menu (cascade delete sur les items)
    await this.prisma.menu.delete({
      where: { id },
    });
  }
}
