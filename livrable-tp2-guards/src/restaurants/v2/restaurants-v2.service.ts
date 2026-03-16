import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateRestaurantV2Dto } from './dto/create-restaurant-v2.dto';
import { UpdateRestaurantV2Dto } from './dto/update-restaurant-v2.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CuisineType as PrismaCuisineType } from '@prisma/client';

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMetadata;
}

interface FindAllFilters {
  cuisine?: PrismaCuisineType;
  minRating?: number;
  maxRating?: number;
  isOpen?: boolean;
  search?: string;
}

@Injectable()
export class RestaurantsV2Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRestaurantDto: CreateRestaurantV2Dto, userId: number) {
    // Vérifier si un restaurant avec le même nom et adresse existe déjà
    const existingRestaurant = await this.prisma.restaurant.findFirst({
      where: {
        name: {
          equals: createRestaurantDto.name,
          mode: 'insensitive',
        },
        address: {
          equals: createRestaurantDto.address,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
    });

    if (existingRestaurant) {
      throw new ConflictException('Un restaurant avec ce nom et cette adresse existe déjà');
    }

    // Créer le restaurant (lié au propriétaire)
    const restaurant = await this.prisma.restaurant.create({
      data: {
        name: createRestaurantDto.name,
        cuisine: createRestaurantDto.cuisineType,
        address: createRestaurantDto.address,
        countryCode: createRestaurantDto.countryCode,
        localNumber: createRestaurantDto.localNumber,
        rating: createRestaurantDto.rating ?? 0,
        averagePrice: createRestaurantDto.averagePrice,
        deliveryTime: createRestaurantDto.deliveryTime,
        isOpen: createRestaurantDto.isOpen ?? true,
        description: createRestaurantDto.description,
        imageUrl: createRestaurantDto.imageUrl,
        ownerId: userId,
      },
    });

    return restaurant;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: FindAllFilters,
  ): Promise<PaginatedResponse<any>> {
    // Construire les conditions de filtrage
    const where: Prisma.RestaurantWhereInput = {
      deletedAt: null, // Exclure les restaurants soft-deleted
    };

    if (filters?.cuisine) {
      where.cuisine = filters.cuisine;
    }

    if (filters?.minRating !== undefined) {
      where.rating = {
        ...((where.rating as Prisma.FloatFilter) || {}),
        gte: filters.minRating,
      };
    }

    if (filters?.maxRating !== undefined) {
      where.rating = {
        ...((where.rating as Prisma.FloatFilter) || {}),
        lte: filters.maxRating,
      };
    }

    if (filters?.isOpen !== undefined) {
      where.isOpen = filters.isOpen;
    }

    if (filters?.search) {
      where.OR = [
        {
          name: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Calculer le skip et prendre les données
    const skip = (page - 1) * limit;

    const [restaurants, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { rating: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      this.prisma.restaurant.count({ where }),
    ]);

    // Calculer les métadonnées de pagination
    const lastPage = Math.ceil(total / limit);
    const hasNext = page < lastPage;
    const hasPrev = page > 1;

    return {
      data: restaurants,
      meta: {
        total,
        page,
        limit,
        lastPage,
        hasNext,
        hasPrev,
      },
    };
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        menus: {
          include: {
            items: {
              include: {
                categories: true,
              },
            },
          },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
    }

    return restaurant;
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantV2Dto) {
    // Vérifier que le restaurant existe
    const existingRestaurant = await this.prisma.restaurant.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingRestaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
    }

    // Vérifier les doublons si nom ou adresse sont modifiés
    if (updateRestaurantDto.name || updateRestaurantDto.address) {
      const nameToCheck = updateRestaurantDto.name ?? existingRestaurant.name;
      const addressToCheck = updateRestaurantDto.address ?? existingRestaurant.address;

      const duplicate = await this.prisma.restaurant.findFirst({
        where: {
          id: { not: id },
          name: {
            equals: nameToCheck,
            mode: 'insensitive',
          },
          address: {
            equals: addressToCheck,
            mode: 'insensitive',
          },
          deletedAt: null,
        },
      });

      if (duplicate) {
        throw new ConflictException('Un restaurant avec ce nom et cette adresse existe déjà');
      }
    }

    // Mettre à jour le restaurant
    const updateData: Prisma.RestaurantUpdateInput = {};
    
    if (updateRestaurantDto.name) updateData.name = updateRestaurantDto.name;
    if (updateRestaurantDto.cuisineType) updateData.cuisine = updateRestaurantDto.cuisineType;
    if (updateRestaurantDto.address) updateData.address = updateRestaurantDto.address;
    if (updateRestaurantDto.countryCode) updateData.countryCode = updateRestaurantDto.countryCode;
    if (updateRestaurantDto.localNumber) updateData.localNumber = updateRestaurantDto.localNumber;
    if (updateRestaurantDto.rating !== undefined) updateData.rating = updateRestaurantDto.rating;
    if (updateRestaurantDto.averagePrice !== undefined) updateData.averagePrice = updateRestaurantDto.averagePrice;
    if (updateRestaurantDto.deliveryTime !== undefined) updateData.deliveryTime = updateRestaurantDto.deliveryTime;
    if (updateRestaurantDto.isOpen !== undefined) updateData.isOpen = updateRestaurantDto.isOpen;
    if (updateRestaurantDto.description !== undefined) updateData.description = updateRestaurantDto.description;
    if (updateRestaurantDto.imageUrl !== undefined) updateData.imageUrl = updateRestaurantDto.imageUrl;

    const updated = await this.prisma.restaurant.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async remove(id: string): Promise<void> {
    // Vérifier que le restaurant existe
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
    }

    // Soft delete : marquer deletedAt
    await this.prisma.restaurant.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: string) {
    // Restaurer un restaurant soft-deleted
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
    }

    if (!restaurant.deletedAt) {
      throw new ConflictException('Ce restaurant n\'est pas supprimé');
    }

    return await this.prisma.restaurant.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}
