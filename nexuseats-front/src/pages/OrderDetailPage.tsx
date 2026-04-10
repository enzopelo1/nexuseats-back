import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '@/services/order.service';
import { DeliveryMap } from '@/components/DeliveryMap';
import { getSocket } from '@/services/socket';
import type { Order, OrderStatus } from '@/types';

const STATUS_STEPS: OrderStatus[] = [
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'READY',
  'PICKED_UP',
  'DELIVERING',
  'DELIVERED',
];

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  ACCEPTED: 'Acceptee',
  CONFIRMED: 'Confirmee',
  PREPARING: 'En preparation',
  READY: 'Prete',
  PICKED_UP: 'Recuperee',
  DELIVERING: 'En livraison',
  DELIVERED: 'Livree',
  CANCELLED: 'Annulee',
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ?? '';
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    orderService.getById(orderId)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    const socket = getSocket();
    const onUpdate = (data: { orderId: string | number; status: OrderStatus }) => {
      if (String(data.orderId) === String(orderId)) {
        setOrder((prev) => (prev ? { ...prev, status: data.status } : prev));
      }
    };
    socket.on('order:status-update', onUpdate);
    return () => {
      socket.off('order:status-update', onUpdate);
    };
  }, [orderId]);

  const handleCancel = async () => {
    if (!confirm('Annuler cette commande ?')) return;
    try {
      const updated = await orderService.cancel(orderId);
      setOrder(updated);
    } catch (err) {
      console.error('Erreur annulation:', err);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (!order) return <div className="error-page">Commande introuvable</div>;

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const canCancel = ['PENDING', 'CONFIRMED', 'ACCEPTED'].includes(order.status);
  const showMap = ['PICKED_UP', 'DELIVERING'].includes(order.status);

  return (
    <div className="page">
      <button type="button" className="btn-back" onClick={() => navigate('/orders')}>
        ← Retour
      </button>

      <div className="order-detail">
        <div className="order-detail-header">
          <h1>Commande #{order.id}</h1>
          <span className={`order-status status-${String(order.status).toLowerCase()}`}>
            {STATUS_LABELS[order.status] || order.status}
          </span>
        </div>

        {order.status !== 'CANCELLED' && currentStep >= 0 && (
          <div className="status-tracker">
            {STATUS_STEPS.map((step, i) => (
              <div
                key={step}
                className={`status-step ${i <= currentStep ? 'active' : ''} ${
                  i === currentStep ? 'current' : ''
                }`}
              >
                <div className="step-dot" />
                <span>{STATUS_LABELS[step]}</span>
              </div>
            ))}
          </div>
        )}

        {showMap && <DeliveryMap orderId={orderId} />}

        <div className="order-items-detail">
          <h2>Articles</h2>
          <table>
            <thead>
              <tr>
                <th>Article</th>
                <th>Qte</th>
                <th>Prix unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={`${item.menuItemId}-${item.id}`}>
                  <td>{item.menuItem?.name || `Article #${item.menuItemId}`}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice > 0 ? `${item.unitPrice.toFixed(2)} EUR` : '—'}</td>
                  <td>
                    {item.unitPrice > 0
                      ? `${(item.unitPrice * item.quantity).toFixed(2)} EUR`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Total</td>
                <td>{order.totalAmount.toFixed(2)} EUR</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="order-info-grid">
          <div>
            <strong>Restaurant</strong>
            <p>{order.restaurant?.name ?? `ID ${order.restaurantId}`}</p>
          </div>
          <div>
            <strong>Date</strong>
            <p>
              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {canCancel && (
          <button type="button" className="btn-danger" onClick={handleCancel}>
            Annuler la commande
          </button>
        )}
      </div>
    </div>
  );
}
