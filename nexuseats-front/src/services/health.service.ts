import api from './api';

// ── Health & Rate-Limit (Sprint 7) ──
// Ce service materialise les TPs du Sprint 7 : Terminus (/health) + Throttler (429).
// Il n'altere aucun comportement existant : c'est un ajout pur.

export interface HealthStatus {
  status: 'ok' | 'error' | 'shutting_down';
  info?: Record<string, { status: string }>;
  error?: Record<string, { status: string; message?: string }>;
  details?: Record<string, { status: string }>;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // epoch seconds
}

export interface RateLimitProbeResult {
  ok: number;
  throttled: number;
  info?: RateLimitInfo;
}

export const healthService = {
  async check(): Promise<HealthStatus> {
    // L'API Nest expose GET /health (VERSION_NEUTRAL), pas /v1/health.
    const { data } = await api.get<{
      status: string;
      services?: Record<string, { status: string; latency?: number }>;
    }>('/health');
    return {
      status: data.status === 'ok' ? 'ok' : 'error',
      details: data.services
        ? Object.fromEntries(
            Object.entries(data.services).map(([k, v]) => [k, { status: v.status }])
          )
        : undefined,
    };
  },

  /**
   * Envoie N requetes en parallele pour declencher le ThrottlerGuard.
   * Utilise par HealthPage pour la demo S7-TP1.
   */
  async probeRateLimit(burst = 50): Promise<RateLimitProbeResult> {
    let ok = 0;
    let throttled = 0;
    let info: RateLimitInfo | undefined;

    const results = await Promise.allSettled(
      Array.from({ length: burst }, () => api.get('/v1/restaurants'))
    );

    for (const r of results) {
      if (r.status === 'fulfilled') {
        ok++;
        const h = r.value.headers as Record<string, string>;
        if (h['x-ratelimit-limit']) {
          info = {
            limit: Number(h['x-ratelimit-limit']),
            remaining: Number(h['x-ratelimit-remaining']),
            reset: Number(h['x-ratelimit-reset']),
          };
        }
      } else {
        const status = (r.reason as { response?: { status?: number } })?.response?.status;
        if (status === 429) throttled++;
      }
    }
    return { ok, throttled, info };
  },
};
