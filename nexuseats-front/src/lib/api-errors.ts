import axios from 'axios';

/** Extrait un message lisible depuis une réponse Nest (`GlobalExceptionFilter`) ou Axios. */
export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as Record<string, unknown> | undefined;
    const nested = data?.error as Record<string, unknown> | undefined;
    const msg = nested?.message ?? data?.message;
    if (msg != null) {
      return Array.isArray(msg) ? msg.join(' ') : String(msg);
    }
    const status = err.response?.status;
    if (status === 401) return 'Email ou mot de passe incorrect.';
    if (status === 403) return 'Accès refusé.';
    if (status === 404) return 'Ressource introuvable.';
    if (status === 409) return 'Un compte existe déjà avec cet email.';
    if (status === 503) return 'Service temporairement indisponible.';
    if (!err.response) {
      return 'Impossible de contacter le serveur. Vérifiez que l’API tourne (ex. port 3002).';
    }
    return err.message || 'Une erreur est survenue.';
  }
  if (err instanceof Error) return err.message;
  return 'Une erreur est survenue.';
}
