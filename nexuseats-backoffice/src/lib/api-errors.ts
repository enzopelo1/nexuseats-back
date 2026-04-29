import type { AxiosError } from "axios";

export type RestaurantFormFieldKey =
  | "name"
  | "street"
  | "city"
  | "zipCode"
  | "country"
  | "countryCode"
  | "localNumber"
  | "phone"
  | "email"
  | "cuisineType"
  | "averagePrice"
  | "deliveryTime";

type ErrBody = {
  success?: boolean;
  error?: { message?: string | string[]; statusCode?: number };
};

/** Extrait les messages renvoyés par GlobalExceptionFilter Nest (error.message). */
export function getApiErrorMessages(error: unknown): string[] {
  const ax = error as AxiosError<ErrBody>;
  const msg = ax.response?.data?.error?.message;
  if (msg == null) return [];
  if (Array.isArray(msg)) return msg.map(String).filter(Boolean);
  if (typeof msg === "string" && msg.trim()) return [msg.trim()];
  return [];
}

export function getApiErrorToastLine(error: unknown): string {
  const messages = getApiErrorMessages(error);
  if (messages.length > 0) return messages.join(" · ");
  const ax = error as AxiosError;
  if (typeof ax.message === "string" && ax.message) return ax.message;
  return "Erreur";
}

const RULES: { field: RestaurantFormFieldKey; patterns: RegExp[] }[] = [
  { field: "zipCode", patterns: [/zipCode/i, /code postal/i] },
  { field: "countryCode", patterns: [/countryCode/i, /indicatif/i] },
  { field: "localNumber", patterns: [/localNumber/i, /numéro local/i] },
  {
    field: "phone",
    patterns: [/\bphone\b/i, /téléphone/i, /telephone/i, /Le numéro de téléphone/i],
  },
  { field: "email", patterns: [/\bemail\b/i, /e-mail/i, /an email/i] },
  { field: "cuisineType", patterns: [/cuisineType/i, /\bcuisine\b/i] },
  { field: "averagePrice", patterns: [/averagePrice/i, /prix moyen/i] },
  { field: "deliveryTime", patterns: [/deliveryTime/i, /délai.*livraison/i, /entre 10 et 120/i] },
  {
    field: "street",
    patterns: [/\.street\b/i, /\bstreet\b/i, /rue/i],
  },
  { field: "city", patterns: [/\.city\b/i, /\bcity\b/i, /ville/i] },
  {
    field: "country",
    patterns: [/\.country\b/i, /ISO 3166/i, /alpha-2/i, /\bcountry\b/i],
  },
  {
    field: "name",
    patterns: [
      /\bname\b/i,
      /UniqueRestaurant/i,
      /nom\b/i,
      /restaurant.*existe déjà/i,
      /déjà.*nom/i,
    ],
  },
];

const API_PROP_TO_FIELD: Record<string, RestaurantFormFieldKey> = {
  name: "name",
  street: "street",
  city: "city",
  zipCode: "zipCode",
  country: "country",
  countryCode: "countryCode",
  localNumber: "localNumber",
  phone: "phone",
  email: "email",
  cuisineType: "cuisineType",
  averagePrice: "averagePrice",
  deliveryTime: "deliveryTime",
  address: "street",
};

function fieldFromPropertyBan(text: string): RestaurantFormFieldKey | null {
  const m = text.match(/property\s+(\w+)\s+should\s+not\s+exist/i);
  if (!m) return null;
  return API_PROP_TO_FIELD[m[1]] ?? null;
}

function matchField(text: string): RestaurantFormFieldKey | null {
  const banned = fieldFromPropertyBan(text);
  if (banned) return banned;
  for (const { field, patterns } of RULES) {
    if (patterns.some((p) => p.test(text))) return field;
  }
  return null;
}

/** Regroupe les messages de validation par champ (heuristique sur le texte API). */
export function restaurantMessagesByField(messages: string[]): {
  fields: Partial<Record<RestaurantFormFieldKey, string>>;
  general: string[];
} {
  const fields: Partial<Record<RestaurantFormFieldKey, string>> = {};
  const general: string[] = [];

  for (const text of messages) {
    const field = matchField(text);
    if (field) {
      const cur = fields[field];
      fields[field] = cur ? `${cur} ; ${text}` : text;
    } else {
      general.push(text);
    }
  }
  return { fields, general };
}
