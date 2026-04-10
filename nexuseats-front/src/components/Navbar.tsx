import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">NexusEats</Link>
      </div>

      <div className="navbar-links">
        <Link to="/restaurants">Restaurants</Link>
        <Link to="/health">Etat API</Link>

        {isAuthenticated && (
          <>
            <Link to="/orders">Mes commandes</Link>
            <Link to="/cart" className="cart-link">
              Panier {itemCount > 0 && <span className="badge">{itemCount}</span>}
            </Link>
          </>
        )}

        {user?.role === 'admin' && <Link to="/admin">Dashboard</Link>}

        {user?.role === 'restaurant_owner' && <Link to="/my-restaurant">Mon restaurant</Link>}

        {user?.role === 'driver' && <Link to="/deliveries">Livraisons</Link>}
      </div>

      <div className="navbar-auth">
        {isAuthenticated ? (
          <div className="user-menu">
            <span>{user?.firstName} ({user?.role})</span>
            <button onClick={handleLogout}>Deconnexion</button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login">Connexion</Link>
            <Link to="/register" className="btn-primary">Inscription</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
