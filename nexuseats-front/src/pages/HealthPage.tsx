import { useEffect, useState } from 'react';
import {
  healthService,
  type HealthStatus,
  type RateLimitProbeResult,
} from '@/services/health.service';

// ── Page Health & Rate Limit (Sprint 7) ──
// Appelle /api/v1/health (Terminus) + bouton de stress-test (Throttler).
// Ajout pur : ne modifie aucune route existante.

export function HealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [probe, setProbe] = useState<RateLimitProbeResult | null>(null);
  const [probing, setProbing] = useState(false);

  useEffect(() => {
    healthService
      .check()
      .then(setHealth)
      .catch(() => setHealth({ status: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  async function handleProbe() {
    setProbing(true);
    try {
      const result = await healthService.probeRateLimit(50);
      setProbe(result);
    } finally {
      setProbing(false);
    }
  }

  if (loading) return <div className="loading">Chargement...</div>;

  const isOk = health?.status === 'ok';

  return (
    <div className="page">
      <h1>Etat du back-end</h1>

      <section className="health-section">
        <h2>Health check (Sprint 7 - Terminus)</h2>
        <div className={isOk ? 'health-ok' : 'health-ko'}>
          {isOk ? 'Operationnel' : 'Degrade ou indisponible'}
        </div>
        {health?.details && (
          <ul className="health-details">
            {Object.entries(health.details).map(([k, v]) => (
              <li key={k}>
                <strong>{k}</strong> : {v.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="health-section">
        <h2>Test Rate Limit (Sprint 7 - Throttler)</h2>
        <p>Envoie 50 requetes GET /v1/restaurants en rafale.</p>
        <button onClick={handleProbe} disabled={probing} className="btn-primary">
          {probing ? 'En cours...' : 'Lancer le test'}
        </button>

        {probe && (
          <div className="probe-result">
            <p>Acceptees : <strong>{probe.ok}</strong></p>
            <p>Throttlees (429) : <strong>{probe.throttled}</strong></p>
            {probe.info && (
              <p>
                Quota : {probe.info.remaining}/{probe.info.limit} (reset dans{' '}
                {Math.max(0, probe.info.reset - Math.floor(Date.now() / 1000))}s)
              </p>
            )}
            {probe.throttled === 0 && (
              <p className="warning">
                Aucun 429 recu. Verifier que ThrottlerGuard est bien actif cote NestJS.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
