import api from './api';
import type { Order, CreateOrderDto, CursorPagination } from '@/types';
import type { User } from '@/types';

function mapApiOrder(raw: Record<string, unknown>, user?: User | null): Order {
  const status = (raw.status as Order['status']) || 'PENDING';
  const createdAt =
    typeof raw.createdAt === 'string'
      ? raw.createdAt
      : raw.createdAt instanceof Date
        ? raw.createdAt.toISOString()
        : new Date().toISOString();
  const total = Number(raw.total ?? 0);
  const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
  return {
    id: String(raw.id),
    status,
    totalAmount: total,
    items: itemsRaw.map((it: Record<string, unknown>, idx: number) => {
      const menuItemId = it.menuItemId != null ? String(it.menuItemId) : '';
      const unitPrice = Number(it.unitPrice ?? 0);
      const name =
        typeof it.name === 'string' && it.name.trim() !== ''
          ? it.name
          : `Article ${menuItemId ? menuItemId.slice(0, 8) : `#${idx}`}`;
      return {
        id: idx,
        menuItemId: menuItemId || idx,
        menuItem: {
          id: menuItemId || idx,
          name,
          description: '',
          price: unitPrice,
          category: '',
          available: true,
          restaurantId: String(raw.restaurantId ?? ''),
        },
        quantity: Number(it.quantity ?? 1),
        unitPrice,
      };
    }),
    restaurantId: String(raw.restaurantId ?? ''),
    userId: user?.id ?? 0,
    createdAt,
    updatedAt: createdAt,
  };
}

export const orderService = {
  async list(cursor?: string): Promise<CursorPagination<Order>> {
    void cursor;
    const { data } = await api.get('/v1/orders');
    const list = Array.isArray(data) ? data : [];
    const userStr = localStorage.getItem('user');
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    return {
      data: list.map((o) => mapApiOrder(o as Record<string, unknown>, user)),
      cursor: null,
      hasMore: false,
    };
  },

  async getById(id: string): Promise<Order> {
    const { data } = await api.get(`/v1/orders/${id}`);
    const userStr = localStorage.getItem('user');
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    return mapApiOrder(data as Record<string, unknown>, user);
  },

  async create(dto: CreateOrderDto, customerEmail: string, orderTotal: number): Promise<Order> {
    const { data } = await api.post('/v1/orders', {
      customerEmail,
      restaurantId: dto.restaurantId,
      items: dto.items.map((i) => ({
        menuItemId: String(i.menuItemId),
        quantity: i.quantity,
        ...(i.name != null ? { name: i.name } : {}),
        ...(i.unitPrice != null ? { unitPrice: i.unitPrice } : {}),
      })),
      total: orderTotal,
    });
    const userStr = localStorage.getItem('user');
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    return mapApiOrder(data as Record<string, unknown>, user);
  },

  async cancel(id: string): Promise<Order> {
    const { data } = await api.patch(`/v1/orders/${id}/status`, { status: 'CANCELLED' });
    const userStr = localStorage.getItem('user');
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    return mapApiOrder(data as Record<string, unknown>, user);
  },

  async updateStatus(id: string, status: string): Promise<Order> {
    const { data } = await api.patch(`/v1/orders/${id}/status`, { status });
    const userStr = localStorage.getItem('user');
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    return mapApiOrder(data as Record<string, unknown>, user);
  },
};
