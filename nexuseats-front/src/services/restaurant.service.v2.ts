import api from './api';
import type { Restaurant } from '@/types';

// ── Demo versioning v1 -> v2 (Sprint 9) ──
// Sert de support au TP3 du Sprint 9 (deprecation + migration).
// Appelle /v2/restaurants ; si 404, fallback transparent sur /v1 et log le header Deprecation.
// Ajout pur : n'altere pas restaurant.service.ts d'origine.

export interface RestaurantPageV2 {
  items: Restaurant[];
  nextCursor: string | null;
  deprecated?: string;
}

export const restaurantServiceV2 = {
  async list(cursor?: string): Promise<RestaurantPageV2> {
    try {
      const { data } = await api.get('/v2/restaurants', {
        params: cursor ? { cursor } : {},
      });
      return data as RestaurantPageV2;
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status !== 404) throw err;

      // ── Fallback v1 ──
      const res = await api.get('/v1/restaurants', {
        params: cursor ? { cursor } : {},
      });
      const headers = res.headers as Record<string, string>;
      const deprecation = headers['deprecation'];
      const sunset = headers['sunset'];

      if (deprecation) {
        // eslint-disable-next-line no-console
        console.warn(
          `[API] /v1/restaurants est deprecie (sunset: ${sunset ?? 'non precise'}). ` +
            `Migrer vers /v2/restaurants.`
        );
      }

      return {
        items: res.data.data,
        nextCursor: res.data.cursor,
        deprecated: sunset ? `Sunset: ${sunset}` : undefined,
      };
    }
  },
};
