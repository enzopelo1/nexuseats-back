import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    // Vérifier que le menu existe
    const menu = await this.prisma.menu.findUnique({
      where: { id: createMenuItemDto.menuId },
    });

    if (!menu) {
      throw new NotFoundException(`Menu avec l'ID ${createMenuItemDto.menuId} non trouvé`);
    }

    // Vérifier que les catégories existent si fournies
    if (createMenuItemDto.categoryIds && createMenuItemDto.categoryIds.length > 0) {
      const categories = await this.prisma.category.findMany({
        where: {
          id: { in: createMenuItemDto.categoryIds },
        },
      });

      if (categories.length !== createMenuItemDto.categoryIds.length) {
        throw new NotFoundException('Une ou plusieurs catégories n\'existent pas');
      }
    }

    // Créer l'item avec les catégories
    return await this.prisma.menuItem.create({
      data: {
        name: createMenuItemDto.name,
        description: createMenuItemDto.description,
        price: createMenuItemDto.price,
        imageUrl: createMenuItemDto.imageUrl,
        available: createMenuItemDto.available ?? true,
        menuId: createMenuItemDto.menuId,
        ...(createMenuItemDto.categoryIds && createMenuItemDto.categoryIds.length > 0 && {
          categories: {
            connect: createMenuItemDto.categoryIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        menu: true,
        categories: true,
      },
    });
  }

  async findAllByMenu(menuId: string) {
    // Vérifier que le menu existe
    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId },
    });

    if (!menu) {
      throw new NotFoundException(`Menu avec l'ID ${menuId} non trouvé`);
    }

    return await this.prisma.menuItem.findMany({
      where: {
        menuId,
      },
      include: {
        categories: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        menu: {
          include: {
            restaurant: true,
          },
        },
        categories: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`MenuItem avec l'ID ${id} non trouvé`);
    }

    return menuItem;
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    // Vérifier que l'item existe
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`MenuItem avec l'ID ${id} non trouvé`);
    }

    // Vérifier que les catégories existent si fournies
    if (updateMenuItemDto.categoryIds && updateMenuItemDto.categoryIds.length > 0) {
      const categories = await this.prisma.category.findMany({
        where: {
          id: { in: updateMenuItemDto.categoryIds },
        },
      });

      if (categories.length !== updateMenuItemDto.categoryIds.length) {
        throw new NotFoundException('Une ou plusieurs catégories n\'existent pas');
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      ...(updateMenuItemDto.name && { name: updateMenuItemDto.name }),
      ...(updateMenuItemDto.description !== undefined && { description: updateMenuItemDto.description }),
      ...(updateMenuItemDto.price !== undefined && { price: updateMenuItemDto.price }),
      ...(updateMenuItemDto.imageUrl !== undefined && { imageUrl: updateMenuItemDto.imageUrl }),
      ...(updateMenuItemDto.available !== undefined && { available: updateMenuItemDto.available }),
    };

    // Gérer les catégories si fournies (disconnect puis connect)
    if (updateMenuItemDto.categoryIds !== undefined) {
      updateData.categories = {
        set: [], // Déconnecter toutes les catégories existantes
        connect: updateMenuItemDto.categoryIds.map((id) => ({ id })),
      };
    }

    return await this.prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: {
        menu: true,
        categories: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    // Vérifier que l'item existe
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem) {
      throw new NotFoundException(`MenuItem avec l'ID ${id} non trouvé`);
    }

    // Supprimer l'item (les relations N:M sont automatiquement nettoyées)
    await this.prisma.menuItem.delete({
      where: { id },
    });
  }
}
