# Pas-a-pas : connecter votre API NestJS au front NexusEats

Ce guide decrit **dans l'ordre** chaque brique que votre back doit exposer pour que le front fonctionne de bout en bout. Chaque etape renvoie au sprint correspondant.

> Regle d'or : **avancez lineairement**. Ne passez a l'etape suivante que lorsque la precedente repond correctement dans les DevTools du navigateur (onglet Network).

---

## Etape 0 — Bootstrap NestJS (Sprint 2)

Dans `main.ts` :

```ts
app.setGlobalPrefix('api');
app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
app.enableCors({ origin: 'http://localhost:3000', credentials: true });
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
await app.listen(3001);
```

**Test** : `curl http://localhost:3001/api/v1/restaurants` repond (meme 401/404, peu importe).

---

## Etape 1 — Auth (Sprint 4)

Le front attend exactement ces 5 routes, **sans versioning** (v1/v2 uniquement pour les ressources metier) :

| Route | Protection | Body | Reponse |
|---|---|---|---|
| `POST /api/auth/register` | publique | `RegisterDto` | `{ user, tokens }` |
| `POST /api/auth/login` | publique | `LoginDto` | `{ user, tokens }` |
| `POST /api/auth/refresh` | **publique** | `{ refreshToken }` | `{ accessToken, refreshToken }` |
| `POST /api/auth/logout` | JWT | `{ refreshToken }` | 204 |
| `GET  /api/auth/profile` | JWT | — | `User` |

Piege classique : `/auth/refresh` NE DOIT PAS avoir le JwtGuard. L'interceptor axios (`src/services/api.ts` l.30) l'appelle sans token quand le precedent est expire. S'il est protege : boucle de deconnexion infinie.

```ts
@Controller({ path: 'auth', version: VERSION_NEUTRAL })
export class AuthController {
  @Public() @Post('refresh') refresh(...) {}
}
```

**Test front** : inscription → login → recharger la page → le profil reste charge (cf. `AuthContext`).

---

## Etape 2 — Restaurants v1 (Sprints 2, 3, 5)

| Route | Shape |
|---|---|
| `GET /api/v1/restaurants?cursor&search` | `{ data: Restaurant[], cursor: string\|null, hasMore: boolean }` |
| `GET /api/v1/restaurants/:id` | `Restaurant` |
| `POST /api/v1/restaurants` | admin/owner |
| `PATCH /api/v1/restaurants/:id` | admin/owner |
| `DELETE /api/v1/restaurants/:id` | admin |

Champs exiges : `id, name, description, address, phone, isOpen, rating, imageUrl?, ownerId, createdAt`.

**Cache Redis (S5-TP3)** : mettre en cache la liste avec TTL 60s. Le front n'en a pas besoin pour fonctionner mais c'est la seule facon de valider le TP.

**Test front** : `/restaurants` affiche la liste et le scroll infini charge la page suivante.

---

## Etape 3 — Menus via GraphQL (Sprint 1, 8)

Le front appelle une query **unique** :

```graphql
query GetRestaurantMenus($restaurantId: Int!) {
  restaurant(id: $restaurantId) {
    id name
    menus {
      id name
      items { id name description price imageUrl category available }
    }
  }
}
```

Installer `@nestjs/graphql` + `@nestjs/apollo`, exposer `/graphql` sur le meme port 3001. Le proxy Vite redirige automatiquement.

**Test front** : clic sur un restaurant -> la page detail affiche les menus.

---

## Etape 4 — Commandes v1 (Sprint 3, 4)

| Route | Guard | Shape |
|---|---|---|
| `GET /api/v1/orders?cursor` | JWT | `{ data, cursor, hasMore }` filtre sur l'user |
| `GET /api/v1/orders/:id` | JWT + ownership | `Order` complet (avec items, restaurant) |
| `POST /api/v1/orders` | JWT customer | body `CreateOrderDto` |
| `PATCH /api/v1/orders/:id/cancel` | JWT owner | `Order` |
| `PATCH /api/v1/orders/:id/status` | JWT admin/driver | body `{ status }` |

Statuts valides : `PENDING, CONFIRMED, PREPARING, READY, PICKED_UP, DELIVERING, DELIVERED, CANCELLED`.

**Test front** : ajouter au panier -> payer -> apparait dans `/orders`.

---

## Etape 5 — WebSocket livraison (Sprint 8)

Gateway Socket.io sur le **meme port** que l'API. Le front se connecte avec :

```ts
io(url, { auth: { token: accessToken }, transports: ['websocket', 'polling'] })
```

Cote NestJS, le token est dans `client.handshake.auth.token` (pas dans les headers) :

```ts
@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class DeliveryGateway {
  handleConnection(client: Socket) {
    const token = client.handshake.auth.token as string;
    // verifier le JWT, sinon client.disconnect()
  }

  @SubscribeMessage('delivery:subscribe')
  handleSubscribe(client: Socket, { orderId }: { orderId: number }) {
    client.join(`order-${orderId}`);
  }
}
```

Evenements a emettre vers la room `order-${orderId}` :

| Evenement | Payload |
|---|---|
| `delivery:location` | `{ orderId, lat, lng, timestamp }` |
| `order:status-update` | `{ orderId, status }` |

**Test front** : ouvrir `/orders/:id` avec une commande `DELIVERING` -> la carte Leaflet bouge si votre gateway emet des positions.

---

## Etape 6 — Dashboard admin GraphQL (Sprint 8)

Query unique, pollee toutes les 30s par `AdminDashboardPage.tsx` :

```graphql
query GetDashboardStats {
  dashboardStats {
    totalOrders totalRevenue totalRestaurants totalUsers
    ordersByStatus { status count }     # forme TABLEAU
    revenueByDay { date revenue }
    recentOrders { id status totalAmount createdAt restaurant { name } }
  }
}
```

**Attention** : `ordersByStatus` est un **tableau** `[{status, count}]`, pas un objet. Le resolver doit donc faire un `groupBy` et renvoyer un array.

**Test front** : `/admin` avec un compte admin -> graphiques affiches.

---

## Etape 7 — Validation & Erreurs RFC 7807 (Sprint 5)

Tous les retours d'erreur doivent suivre le format :

```json
{
  "type": "https://nexuseats.dev/errors/validation",
  "title": "Validation Error",
  "status": 422,
  "detail": "...",
  "instance": "/api/auth/register",
  "errors": { "email": ["must be a valid email"] }
}
```

Le front dispose de `src/utils/errorHandler.ts` (`parseError` / `formatError`) pour afficher proprement ces messages.

**Test front** : tenter un login avec un mauvais mot de passe -> l'erreur affichee doit contenir le `title` du back.

---

## Etape 8 — Performance (Sprint 7)

- `GET /api/v1/health` : Terminus (db + redis + memory). Shape `{ status: 'ok', info, details }`.
- ThrottlerGuard global -> headers `X-RateLimit-Limit / Remaining / Reset`.
- Compression gzip.

**Test front** : page `/health` -> les deux sections (health + probe rate-limit) doivent reagir.

---

## Etape 9 — Versioning v2 (Sprint 9)

Exposer `GET /api/v2/restaurants` avec la nouvelle shape :

```json
{ "items": [...], "nextCursor": "eyJ..." }
```

Et sur `v1`, renvoyer les headers :

```
Deprecation: true
Sunset: Wed, 31 Dec 2025 23:59:59 GMT
```

**Test front** : utiliser `restaurantServiceV2.list()` dans une page de test ; la console doit logger le warning de depreciation.

---

## Etape 10 — Production (Sprint 10)

Fichiers fournis dans `ops/` :

- `ops/nginx.conf` — reverse-proxy unifie (/, /api, /graphql, /socket.io)
- `ops/docker-compose.prod.yml` — stack complete db + redis + api + nginx

Commandes :

```bash
npm run build                               # genere dist/
cd ops && docker compose -f docker-compose.prod.yml up -d
```

Acceder a `http://<host>/` — tout passe par Nginx sur le port 80.

---

## Checklist de validation finale

- [ ] Inscription -> login -> profil persistant apres refresh
- [ ] Liste restaurants avec pagination cursor
- [ ] Detail restaurant + menus (GraphQL)
- [ ] Creation commande -> apparait dans /orders
- [ ] Suivi temps reel (WebSocket) sur une commande DELIVERING
- [ ] Dashboard admin avec graphiques
- [ ] /health vert + probe rate-limit declenche des 429
- [ ] Messages d'erreur formates RFC 7807
- [ ] v2/restaurants repond + v1 log la depreciation
- [ ] Stack docker-compose lancee, tout accessible via port 80
