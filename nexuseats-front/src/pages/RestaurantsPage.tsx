import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { restaurantService } from '@/services/restaurant.service';
import type { Restaurant } from '@/types';

export function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState('');
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async (nextCursor?: string, searchTerm?: string) => {
    setLoading(true);
    try {
      const result = await restaurantService.list(nextCursor, searchTerm);
      if (nextCursor) {
        setRestaurants((prev) => [...prev, ...result.data]);
      } else {
        setRestaurants(result.data);
      }
      setCursor(result.cursor);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Erreur chargement restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(undefined, search || undefined);
  }, [search]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Restaurants</h1>
        <div className="search-bar">
          <input
            type="search"
            placeholder="Rechercher un restaurant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && restaurants.length === 0 ? (
        <div className="loading">Chargement des restaurants...</div>
      ) : (
        <>
          <div className="restaurant-grid">
            {restaurants.map((r) => (
              <Link to={`/restaurants/${r.id}`} key={r.id} className="restaurant-card">
                <div
                  className="restaurant-image"
                  style={{
                    backgroundImage: r.imageUrl ? `url(${r.imageUrl})` : undefined,
                  }}
                >
                  {!r.imageUrl && <span className="placeholder-icon">🍽️</span>}
                  <span className={`status-badge ${r.isOpen ? 'open' : 'closed'}`}>
                    {r.isOpen ? 'Ouvert' : 'Ferme'}
                  </span>
                </div>
                <div className="restaurant-info">
                  <h3>{r.name}</h3>
                  <p>{r.description}</p>
                  <div className="restaurant-meta">
                    <span className="rating">⭐ {r.rating.toFixed(1)}</span>
                    <span className="address">{r.address}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {restaurants.length === 0 && !loading && (
            <p className="empty-state">Aucun restaurant trouve.</p>
          )}

          {hasMore && (
            <button
              className="btn-secondary load-more"
              onClick={() => fetchRestaurants(cursor || undefined, search || undefined)}
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Voir plus'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
