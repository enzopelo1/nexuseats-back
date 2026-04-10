import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useDeliveryTracking } from '@/hooks/useDeliveryTracking';

interface Props {
  orderId: string | number;
  restaurantLat?: number;
  restaurantLng?: number;
  customerLat?: number;
  customerLng?: number;
}

export function DeliveryMap({
  orderId,
  restaurantLat = 48.8566,
  restaurantLng = 2.3522,
  customerLat = 48.8606,
  customerLng = 2.3376,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const driverMarker = useRef<L.Marker | null>(null);
  const { location, connected } = useDeliveryTracking(orderId);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([restaurantLat, restaurantLng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    // Marqueur restaurant
    L.marker([restaurantLat, restaurantLng])
      .addTo(map)
      .bindPopup('Restaurant');

    // Marqueur client
    L.marker([customerLat, customerLng])
      .addTo(map)
      .bindPopup('Adresse de livraison');

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [restaurantLat, restaurantLng, customerLat, customerLng]);

  // Mise a jour position livreur
  useEffect(() => {
    if (!location || !mapInstance.current) return;

    const driverIcon = L.divIcon({
      html: '<div style="font-size:24px">🛵</div>',
      iconSize: [30, 30],
      className: 'driver-icon',
    });

    if (driverMarker.current) {
      driverMarker.current.setLatLng([location.lat, location.lng]);
    } else {
      driverMarker.current = L.marker([location.lat, location.lng], { icon: driverIcon })
        .addTo(mapInstance.current)
        .bindPopup('Livreur');
    }

    mapInstance.current.panTo([location.lat, location.lng]);
  }, [location]);

  return (
    <div className="delivery-map-container">
      <div className="connection-status">
        {connected ? '🟢 Connexion temps reel active' : '🔴 Connexion perdue'}
      </div>
      <div ref={mapRef} style={{ height: '400px', width: '100%', borderRadius: '8px' }} />
      {location && (
        <p className="last-update">
          Derniere position : {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
}
