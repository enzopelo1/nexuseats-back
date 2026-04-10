// ── Utilisateurs & Auth ──
export type UserRole = 'admin' | 'customer' | 'owner' | 'restaurant_owner' | 'driver';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// ── Restaurants ──
export interface Restaurant {
  id: string | number;
  name: string;
  description: string;
  address: string;
  phone?: string;
  isOpen: boolean;
  rating: number;
  imageUrl?: string;
  ownerId: number;
  createdAt: string;
}

// ── Menus & Items ──
export interface MenuItem {
  id: string | number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  available: boolean;
  restaurantId: string | number;
}

export interface Menu {
  id: string | number;
  name: string;
  items: MenuItem[];
  restaurantId: string | number;
}

// ── Commandes ──
export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'PICKED_UP'
  | 'DELIVERING'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: number;
  /** Identifiant article (souvent UUID côté API v2) */
  menuItemId: string | number;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string | number;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  restaurantId: string | number;
  restaurant?: Restaurant;
  userId: number;
  driverId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  restaurantId: string;
  items: {
    menuItemId: string;
    quantity: number;
    /** Snapshot affichage (microservice Orders) */
    name?: string;
    unitPrice?: number;
  }[];
}

// ── Livraison temps reel ──
export interface DeliveryLocation {
  orderId: string | number;
  lat: number;
  lng: number;
  timestamp: string;
}

// ── Dashboard admin ──
export interface OrderStatusCount {
  status: OrderStatus;
  count: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalRestaurants: number;
  totalUsers: number;
  recentOrders: Order[];
  ordersByStatus: OrderStatusCount[];
  revenueByDay: { date: string; revenue: number }[];
}

// ── Pagination cursor ──
export interface CursorPagination<T> {
  data: T[];
  cursor: string | null;
  hasMore: boolean;
}

// ── Review ──
export interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  restaurantId: number;
  createdAt: string;
}
