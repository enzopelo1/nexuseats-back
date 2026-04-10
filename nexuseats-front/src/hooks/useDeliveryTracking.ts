import { useEffect, useState } from 'react';
import { getSocket } from '@/services/socket';
import type { DeliveryLocation } from '@/types';

export function useDeliveryTracking(orderId: string | number) {
  const [location, setLocation] = useState<DeliveryLocation | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // S'abonner aux mises a jour de position
    socket.emit('delivery:subscribe', { orderId });

    socket.on('delivery:location', (data: DeliveryLocation) => {
      if (String(data.orderId) === String(orderId)) {
        setLocation(data);
      }
    });

    // Ecouter aussi les changements de statut
    socket.on('order:status-update', (data: { orderId: string | number; status: string }) => {
      if (String(data.orderId) === String(orderId)) {
        // Le composant parent gerera le changement de statut via son propre state
      }
    });

    return () => {
      socket.emit('delivery:unsubscribe', { orderId });
      socket.off('delivery:location');
      socket.off('order:status-update');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [orderId]);

  return { location, connected };
}
