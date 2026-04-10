import type { AxiosError } from 'axios';

// ── Parseur RFC 7807 (Sprint 5 - Exception Filters) ──
// Centralise l'extraction des ProblemDetails renvoyes par le back.
// Ajout pur : a importer dans les .catch des pages au besoin.

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

const isProblem = (x: unknown): x is ProblemDetails =>
  !!x && typeof x === 'object' && 'title' in x && 'status' in x;

export function parseError(err: unknown): ProblemDetails {
  const axErr = err as AxiosError<ProblemDetails>;

  if (axErr?.response?.data && isProblem(axErr.response.data)) {
    return axErr.response.data;
  }

  return {
    type: 'about:blank',
    title: axErr?.message ?? 'Erreur inconnue',
    status: axErr?.response?.status ?? 0,
    detail:
      "Le serveur n'a pas renvoye de ProblemDetails RFC 7807 " +
      '(exception filter non conforme au Sprint 5).',
  };
}

export function formatError(err: unknown): string {
  const p = parseError(err);
  if (p.errors) {
    const lines = Object.entries(p.errors).map(
      ([field, msgs]) => `${field}: ${msgs.join(', ')}`
    );
    return `${p.title}\n${lines.join('\n')}`;
  }
  return p.detail ? `${p.title} — ${p.detail}` : p.title;
}
