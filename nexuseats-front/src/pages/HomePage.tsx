import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>
            NexusEats
          </h1>
          <p className="hero-subtitle">
            Vos restaurants preferes, livres chez vous en quelques minutes.
          </p>
          <div className="hero-actions">
            <Link to="/restaurants" className="btn-primary btn-large">
              Voir les restaurants
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn-secondary btn-large">
                Creer un compte
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <span className="feature-icon">🍔</span>
          <h3>Large choix</h3>
          <p>Des centaines de restaurants a portee de clic</p>
        </div>
        <div className="feature">
          <span className="feature-icon">🚀</span>
          <h3>Livraison rapide</h3>
          <p>Suivi en temps reel de votre commande</p>
        </div>
        <div className="feature">
          <span className="feature-icon">🔒</span>
          <h3>Paiement securise</h3>
          <p>Vos transactions sont protegees</p>
        </div>
      </section>
    </div>
  );
}
