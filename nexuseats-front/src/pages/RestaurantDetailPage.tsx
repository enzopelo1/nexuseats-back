import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantService } from '@/services/restaurant.service';
import api from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import type { Restaurant, MenuItem } from '@/types';

type ApiMenu = {
  id: string;
  name: string;
  items?: {
    id: string;
    name: string;
    description?: string | null;
    price: unknown;
    imageUrl?: string | null;
    available?: boolean;
    categories?: { name: string }[];
  }[];
};

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const restaurantId = id ?? '';
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<ApiMenu[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!restaurantId) return;
    restaurantService.getById(restaurantId).then(setRestaurant).catch(console.error);
  }, [restaurantId]);

  useEffect(() => {
    if (!restaurantId) return;
    setMenuLoading(true);
    api
      .get(`/v1/restaurants/${restaurantId}/menus`)
      .then((res) => setMenus((res.data as ApiMenu[]) ?? []))
      .catch(console.error)
      .finally(() => setMenuLoading(false));
  }, [restaurantId]);

  if (!restaurant) return <div className="loading">Chargement...</div>;

  const toMenuItem = (_menuId: string, it: NonNullable<ApiMenu['items']>[0]): MenuItem => ({
    id: it.id,
    name: it.name,
    description: it.description ?? '',
    price: Number(it.price),
    imageUrl: it.imageUrl ?? undefined,
    category: it.categories?.map((c) => c.name).join(', ') ?? '',
    available: it.available !== false,
    restaurantId,
  });

  return (
    <div className="page">
      <div className="restaurant-detail-header">
        <div
          className="restaurant-hero"
          style={{
            backgroundImage: restaurant.imageUrl ? `url(${restaurant.imageUrl})` : undefined,
          }}
        >
          <div className="hero-overlay">
            <h1>{restaurant.name}</h1>
            <p>{restaurant.description}</p>
            <div className="restaurant-meta">
              <span>Note {restaurant.rating.toFixed(1)} / 5</span>
              <span>{restaurant.address}</span>
              {restaurant.phone ? <span>{restaurant.phone}</span> : null}
              <span className={restaurant.isOpen ? 'open' : 'closed'}>
                {restaurant.isOpen ? 'Ouvert' : 'Ferme'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <h2>Menu</h2>
        {menuLoading ? (
          <div className="loading">Chargement du menu...</div>
        ) : menus.length === 0 ? (
          <p className="empty-state">Aucun menu disponible.</p>
        ) : (
          menus.map((menu) => (
            <div key={menu.id} className="menu-category">
              <h3>{menu.name}</h3>
              <div className="menu-items-grid">
                {(menu.items ?? [])
                  .filter((item) => item.available !== false)
                  .map((item) => {
                    const mi = toMenuItem(menu.id, item);
                    return (
                      <div key={item.id} className="menu-item-card">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="menu-item-image" />
                        )}
                        <div className="menu-item-info">
                          <h4>{item.name}</h4>
                          <p>{item.description}</p>
                          <div className="menu-item-footer">
                            <span className="price">{mi.price.toFixed(2)} EUR</span>
                            {isAuthenticated && restaurant.isOpen && (
                              <button type="button" className="btn-add" onClick={() => addItem(mi)}>
                                Ajouter
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
