export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city?: string;
  countryCode?: string;
  localNumber?: string;
  phone?: string;
  isOpen: boolean;
  cuisine?: string;
  createdAt?: string;
}

export interface Dish {
  id: string;
  menuId: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
}

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: string;
  customerEmail?: string;
  userId?: number;
  restaurantId: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: { menuItemId?: string; dishId?: number; name?: string; quantity: number; price?: number }[];
}

export interface UserRow {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "MANAGER" | "CLIENT";
  createdAt: string;
}
