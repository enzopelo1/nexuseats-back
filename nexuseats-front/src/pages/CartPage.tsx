import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/order.service';

export function CartPage() {
  const { user } = useAuth();
  const { items, total, updateQuantity, removeItem, clearCart, restaurantId } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!restaurantId || items.length === 0) return;

    setLoading(true);
    setError('');
    try {
      if (!user?.email) {
        setError('Connectez-vous pour commander');
        return;
      }
      const grandTotal = total + 2.99;
      const order = await orderService.create(
        {
          restaurantId,
          items: items.map((i) => ({
            menuItemId: String(i.menuItem.id),
            quantity: i.quantity,
            name: i.menuItem.name,
            unitPrice: i.menuItem.price,
          })),
        },
        user.email,
        grandTotal,
      );
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la commande';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Panier</h1>
        <div className="empty-state">
          <p>Votre panier est vide.</p>
          <button className="btn-primary" onClick={() => navigate('/restaurants')}>
            Voir les restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Panier</h1>
      {error && <div className="error-banner">{error}</div>}

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.menuItem.id} className="cart-item">
              <div className="cart-item-info">
                <h3>{item.menuItem.name}</h3>
                <p className="price">{item.menuItem.price.toFixed(2)} EUR</p>
              </div>
              <div className="cart-item-actions">
                <button
                  className="btn-quantity"
                  onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  className="btn-quantity"
                  onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                >
                  +
                </button>
                <button className="btn-remove" onClick={() => removeItem(item.menuItem.id)}>
                  Supprimer
                </button>
              </div>
              <div className="cart-item-subtotal">
                {(item.menuItem.price * item.quantity).toFixed(2)} EUR
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Resume</h2>
          <div className="summary-line">
            <span>Sous-total</span>
            <span>{total.toFixed(2)} EUR</span>
          </div>
          <div className="summary-line">
            <span>Frais de livraison</span>
            <span>2.99 EUR</span>
          </div>
          <div className="summary-line total">
            <span>Total</span>
            <span>{(total + 2.99).toFixed(2)} EUR</span>
          </div>
          <button className="btn-primary btn-checkout" onClick={handleCheckout} disabled={loading}>
            {loading ? 'Commande en cours...' : 'Commander'}
          </button>
          <button className="btn-secondary" onClick={clearCart}>
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  );
}
