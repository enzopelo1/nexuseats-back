# NexusEats Front — Guide de configuration

## 1. Installation

```bash
npm install
```

## 2. Configuration

Copier le fichier d'environnement :

```bash
cp .env.example .env
```

### Option A — API sur la meme machine (recommande)

Si votre API NestJS tourne sur `localhost:3001`, **ne changez rien**.
Le proxy Vite redirige automatiquement les appels `/api/*`, `/graphql` et `/socket.io` vers votre backend.

```env
VITE_API_URL=/api
VITE_GRAPHQL_URL=/graphql
VITE_WS_URL=
```

### Option B — API sur un serveur distant ou un autre port

Modifiez le fichier `.env` avec l'URL complete de votre API :

```env
VITE_API_URL=http://192.168.1.50:3001/api
VITE_GRAPHQL_URL=http://192.168.1.50:3001/graphql
VITE_WS_URL=http://192.168.1.50:3001
```

> **Important** : dans ce cas, votre API NestJS doit autoriser le CORS depuis `http://localhost:3000`.
> Dans `main.ts` de votre projet NestJS, ajoutez :
>
> ```typescript
> app.enableCors({
>   origin: 'http://localhost:3000',
>   credentials: true,
> });
> ```

## 3. Lancement

```bash
npm run dev
```

Le front demarre sur **http://localhost:3000**.

## 4. Build production

```bash
npm run build
```

Les fichiers statiques sont generes dans le dossier `dist/`.
Vous pouvez les servir avec n'importe quel serveur HTTP (Nginx, serve, etc.).

## 5. Endpoints attendus cote NestJS

Votre API doit exposer ces routes pour que le front fonctionne :

### REST (`/api/...`)

| Methode | Route                      | Description                        |
|---------|----------------------------|------------------------------------|
| POST    | `/api/auth/register`       | Inscription                        |
| POST    | `/api/auth/login`          | Connexion (retourne access+refresh)|
| POST    | `/api/auth/refresh`        | Rafraichir le token                |
| POST    | `/api/auth/logout`         | Deconnexion                        |
| GET     | `/api/auth/profile`        | Profil de l'utilisateur connecte   |
| GET     | `/api/v1/restaurants`      | Liste (params: cursor, search)     |
| GET     | `/api/v1/restaurants/:id`  | Detail d'un restaurant             |
| GET     | `/api/v1/orders`           | Commandes de l'utilisateur         |
| GET     | `/api/v1/orders/:id`       | Detail d'une commande              |
| POST    | `/api/v1/orders`           | Creer une commande                 |
| PATCH   | `/api/v1/orders/:id/cancel`| Annuler une commande               |
| PATCH   | `/api/v1/orders/:id/status`| Changer le statut (admin/driver)   |

### GraphQL (`/graphql`)

Le front envoie deux queries :

- `GetRestaurantMenus(restaurantId)` — menus et items d'un restaurant
- `GetDashboardStats` — statistiques pour le dashboard admin

### WebSocket (Socket.io)

| Evenement emis (client→serveur) | Description                    |
|---------------------------------|--------------------------------|
| `delivery:subscribe`            | S'abonner au suivi d'une commande |
| `delivery:unsubscribe`          | Se desabonner                  |

| Evenement recu (serveur→client) | Description                    |
|---------------------------------|--------------------------------|
| `delivery:location`             | Position du livreur `{orderId, lat, lng, timestamp}` |
| `order:status-update`           | Changement de statut `{orderId, status}` |

## 6. Format des reponses attendu

### Pagination cursor-based

```json
{
  "data": [...],
  "cursor": "eyJpZCI6MTB9",
  "hasMore": true
}
```

### Login / Register

```json
{
  "user": { "id": 1, "email": "...", "firstName": "...", "lastName": "...", "role": "customer" },
  "tokens": { "accessToken": "...", "refreshToken": "..." }
}
```

### Erreurs (RFC 7807)

```json
{
  "type": "https://nexuseats.dev/errors/validation",
  "title": "Validation Error",
  "status": 422,
  "detail": "Le champ email est invalide",
  "instance": "/api/auth/register"
}
```
