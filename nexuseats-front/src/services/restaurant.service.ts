import api from './api';
import type { Restaurant, CursorPagination } from '@/types';

function mapV2(r: Record<string, unknown>): Restaurant {
  const cc = r.countryCode != null ? String(r.countryCode) : '';
  const ln = r.localNumber != null ? String(r.localNumber) : '';
  return {
    id: String(r.id),
    name: String(r.name ?? ''),
    description: r.description ? String(r.description) : '',
    address: String(r.address ?? ''),
    phone: cc && ln ? `${cc} ${ln}` : undefined,
    isOpen: Boolean(r.isOpen ?? true),
    rating: Number(r.rating ?? 0),
    imageUrl: r.imageUrl ? String(r.imageUrl) : undefined,
    ownerId: r.ownerId != null ? Number(r.ownerId) : 0,
    createdAt: r.createdAt ? String(r.createdAt) : '',
  };
}

export const restaurantService = {
  async list(_cursor?: string, search?: string): Promise<CursorPagination<Restaurant>> {
    const params: Record<string, string | number> = { limit: 50, page: 1 };
    if (search) params.search = search;
    const { data } = await api.get('/v2/restaurants', { params });
    const payload = data as { data?: Record<string, unknown>[]; meta?: { hasNext?: boolean } };
    const items = (payload.data ?? []).map(mapV2);
    return {
      data: items,
      cursor: null,
      hasMore: Boolean(payload.meta?.hasNext),
    };
  },

  async getById(id: string): Promise<Restaurant> {
    const { data } = await api.get(`/v2/restaurants/${id}`);
    return mapV2(data as Record<string, unknown>);
  },

  async create(dto: Partial<Restaurant>): Promise<Restaurant> {
    const { data } = await api.post('/v2/restaurants', dto);
    return mapV2(data as Record<string, unknown>);
  },

  async update(id: string, dto: Partial<Restaurant>): Promise<Restaurant> {
    const { data } = await api.patch(`/v2/restaurants/${id}`, dto);
    return mapV2(data as Record<string, unknown>);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/v2/restaurants/${id}`);
  },
};
