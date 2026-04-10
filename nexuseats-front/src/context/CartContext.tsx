import { createContext, useContext, useState, type ReactNode } from 'react';
import type { MenuItem } from '@/types';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (item: MenuItem) => void;
  removeItem: (menuItemId: string | number) => void;
  updateQuantity: (menuItemId: string | number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const addItem = (menuItem: MenuItem) => {
    const rid = String(menuItem.restaurantId);
    if (restaurantId && restaurantId !== rid) {
      if (!confirm('Votre panier contient des articles d\'un autre restaurant. Voulez-vous le vider ?')) {
        return;
      }
      setItems([]);
    }
    setRestaurantId(rid);

    setItems((prev) => {
      const existing = prev.find((i) => String(i.menuItem.id) === String(menuItem.id));
      if (existing) {
        return prev.map((i) =>
          String(i.menuItem.id) === String(menuItem.id) ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeItem = (menuItemId: string | number) => {
    setItems((prev) => {
      const next = prev.filter((i) => String(i.menuItem.id) !== String(menuItemId));
      if (next.length === 0) setRestaurantId(null);
      return next;
    });
  };

  const updateQuantity = (menuItemId: string | number, quantity: number) => {
    if (quantity <= 0) return removeItem(menuItemId);
    setItems((prev) =>
      prev.map((i) => (String(i.menuItem.id) === String(menuItemId) ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
  };

  const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, restaurantId, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
