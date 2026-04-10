import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '@/services/order.service';
import type { Order } from '@/types';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmee',
  PREPARING: 'En preparation',
  READY: 'Prete',
  PICKED_UP: 'Recuperee',
  DELIVERING: 'En livraison',
  DELIVERED: 'Livree',
  CANCELLED: 'Annulee',
};

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (nextCursor?: string) => {
    setLoading(true);
    try {
      const result = await orderService.list(nextCursor);
      if (nextCursor) {
        setOrders((prev) => [...prev, ...result.data]);
      } else {
        setOrders(result.data);
      }
      setCursor(result.cursor);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Erreur chargement commandes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="page">
      <h1>Mes commandes</h1>

      {loading && orders.length === 0 ? (
        <div className="loading">Chargement...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>Aucune commande pour le moment.</p>
          <Link to="/restaurants" className="btn-primary">
            Commander
          </Link>
        </div>
      ) : (
        <>
          <div className="orders-list">
            {orders.map((order) => (
              <Link to={`/orders/${order.id}`} key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-id">Commande #{order.id}</span>
                  <span className={`order-status status-${order.status.toLowerCase()}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <div className="order-body">
                  <span className="restaurant-name">{order.restaurant?.name}</span>
                  <span className="order-items-count">
                    {order.items?.length || 0} article(s)
                  </span>
                  <span className="order-total">{order.totalAmount.toFixed(2)} EUR</span>
                </div>
                <div className="order-footer">
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <button
              className="btn-secondary load-more"
              onClick={() => fetchOrders(cursor || undefined)}
              disabled={loading}
            >
              Voir plus
            </button>
          )}
        </>
      )}
    </div>
  );
}
