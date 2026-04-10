# Guide NexusEats — API, front client et back-office

Ce document décrit comment les morceaux du projet fonctionnent ensemble et comment les lancer (Docker, base de données, microservice commandes, applications web).

## Vue d’ensemble

| Composant | Rôle | Port / URL habituels |
|-----------|------|----------------------|
| **PostgreSQL** | Données (Prisma) | `localhost:5432` |
| **RabbitMQ** | Messagerie entre l’API et le microservice Orders | `localhost:5672` (AMQP), `http://localhost:15672` (UI) |
| **API NestJS** | REST, auth JWT, restaurants, menus, gateway commandes | `http://localhost:3002` |
| **Microservice Orders** | Traite les commandes en mémoire via RabbitMQ | (pas d’HTTP direct) |
| **Front client** (`nexuseats-front`) | Application React (Vite) | `http://localhost:3000` |
| **Back-office** (`nexuseats-backoffice`) | Interface managers / admins | `http://localhost:5174` |

Flux commande côté client : le front appelle `POST /v1/orders` sur l’API (avec JWT). L’API envoie un message RabbitMQ au microservice **orders-service**, qui crée la commande et notifie d’autres files (notifications / analytics) si ces services écoutent les bonnes files.

Réponses API : la plupart des routes renvoient un corps enveloppé `{ success, data, timestamp }`. Les clients web **désenveloppent** automatiquement `data` dans leurs clients HTTP (axios).

---

## 1. Prérequis

- Node.js (LTS recommandé) et npm
- Docker et Docker Compose (pour Postgres + RabbitMQ)

---

## 2. Démarrer l’infrastructure (Docker)

À la racine du dépôt (`/Users/enzo/Desktop/MDS/Back_api/essaie`), le fichier `docker-compose.yml` démarre :

- **postgres** : utilisateur `nexuseats`, mot de passe `nexuseats_dev`, base `nexuseats`
- **rabbitmq** : utilisateur `nexuseats`, mot de passe `secret`

```bash
cd /Users/enzo/Desktop/MDS/Back_api/essaie
docker compose up -d
```

Vérifier que les conteneurs sont « healthy » (surtout Postgres) avant de lancer les migrations.

Arrêt :

```bash
docker compose down
```

---

## 3. Configuration de l’API (`.env` à la racine)

Créez un fichier `.env` à la racine du projet API (à côté de `package.json`), par exemple :

```env
DATABASE_URL="postgresql://nexuseats:nexuseats_dev@localhost:5432/nexuseats"
PORT=3002
JWT_SECRET="changez-moi-en-production"
RABBITMQ_URL="amqp://nexuseats:secret@localhost:5672"
```

- `DATABASE_URL` doit correspondre aux identifiants du `docker-compose.yml`.
- `RABBITMQ_URL` est utilisée par la gateway commandes et le module admin (comptage des commandes) ; le microservice Orders utilise la même valeur par défaut si la variable n’est pas définie dans son propre processus.

---

## 4. Base de données : migrations et seed

Toujours depuis la racine de l’API :

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
```

Le seed crée notamment :

- `owner@nexus.dev` / `secret123` (rôle **owner**, gestion des restaurants côté API)
- `admin@nexus.dev` / `secret123` (rôle **admin**, back-office : stats, utilisateurs, etc.)
- des restaurants, menus et plats de démonstration

---

## 5. Lancer l’API NestJS

```bash
npm run start:dev
```

- API : `http://localhost:3002`
- Swagger : `http://localhost:3002/api-docs`

Routes utiles (extrait) :

- Auth (sans préfixe de version URI) : `POST /auth/login`, `POST /auth/register`, `GET /auth/profile`
- Restaurants v2 : `GET /v2/restaurants`, `GET /v2/restaurants/:id`, etc.
- Menus / items : `GET /v1/restaurants/:restaurantId/menus`, `POST /v1/menu-items`, etc.
- Commandes : `POST /v1/orders`, `GET /v1/orders`, `GET /v1/orders/:id`, `PATCH /v1/orders/:id/status`
- Admin (JWT **admin** uniquement) : `GET /v1/admin/users`, `PATCH /v1/admin/users/:id/role`, `GET /v1/admin/stats/dashboard`, etc.
- Santé : `GET /health`

---

## 6. Lancer le microservice Orders

Le dossier `orders-service` est un microservice Nest **sans port HTTP** : il consomme la file `orders_queue` sur RabbitMQ.

```bash
cd /Users/enzo/Desktop/MDS/Back_api/essaie/orders-service
npm install
npm run build
npm run start:dev
```

Sans ce processus, les appels HTTP vers les commandes via la gateway peuvent échouer (timeout ou erreur de transport).

Variables utiles (optionnel, défaut aligné sur Docker) :

```env
RABBITMQ_URL=amqp://nexuseats:secret@localhost:5672
```

Les services `notifications-service` et `analytics-service` (autres dossiers du repo) peuvent être démarrés pour consommer les événements émis à la création de commande ; ils ne sont pas obligatoires pour tester la création et la liste des commandes.

---

## 7. Front client (`nexuseats-front`)

### Configuration

Copiez `nexuseats-front/.env.example` vers `nexuseats-front/.env`.

En développement, `VITE_API_URL=/api` utilise le **proxy Vite** défini dans `nexuseats-front/vite.config.ts`, qui redirige vers `http://localhost:3002` (réécriture du chemin : `/api` → racine de l’API).

### Lancer

```bash
cd /Users/enzo/Desktop/MDS/Back_api/essaie/nexuseats-front
npm install
npm run dev
```

Application : `http://localhost:3000`

Le front utilise le JWT stocké en local ; l’inscription n’envoie à l’API que `email`, `password` et `role` (les champs prénom/nom restent dans l’UI mais ne partent pas au backend, pour respecter les DTO Nest).

---

## 8. Back-office (`nexuseats-backoffice`)

### Configuration

Copiez `nexuseats-backoffice/.env.example` vers `nexuseats-backoffice/.env` :

```env
VITE_API_URL=http://localhost:3002
```

Le back-office appelle directement l’API (pas de préfixe `/api`).

### Lancer

```bash
cd /Users/enzo/Desktop/MDS/Back_api/essaie/nexuseats-backoffice
npm install
npm run dev
```

Application : `http://localhost:5174`

### Connexion

- Comptes seed adaptés au back-office : **`admin@nexus.dev`** ou **`owner@nexus.dev`**, mot de passe **`secret123`**.
- Côté API, les rôles sont `admin`, `owner`, `customer`. Le back-office mappe `admin` → ADMIN, `owner` → MANAGER pour l’affichage et les garde pour les appels qui exigent ces rôles sur l’API.

Fonctions branchées sur l’API : restaurants (v2), menus / plats (v1), commandes (liste + changement de statut), tableau de bord admin, utilisateurs (admin), statistiques export CSV, monitoring (`/health`).

La page **Paramètres** du back-office reste locale (aucun endpoint `/settings` sur l’API).

### Gestion des commandes (workflow)

- **Passation** : le client commande sur le **front** (`http://localhost:3000`, panier puis validation).
- **Exploitation** (faire avancer les statuts, annuler) : utiliser le **back-office** → **Commandes** : `http://localhost:5174/orders`. Seuls les JWT **admin** ou **owner** peuvent appeler `PATCH /v1/orders/:id/status` ; connectez-vous avec `admin@nexus.dev` ou `owner@nexus.dev` / `secret123` après seed.
- Le tableau de bord **admin** du front client affiche aussi des actions sur les commandes récentes, mais l’interface dédiée pour les équipes reste le back-office sur le **port 5174**.

---

## 9. Ordre de démarrage recommandé (développement)

1. `docker compose up -d`
2. Migrations + seed (section4)
3. `orders-service` : `npm run start:dev`
4. API : `npm run start:dev` (racine `essaie`)
5. Front et/ou back-office : `npm run dev` dans chaque dossier

---

## 10. Dépannage rapide

- **Erreur Prisma / connexion** : vérifier que Postgres tourne et que `DATABASE_URL` est correct.
- **Commandes qui ne répondent pas** : vérifier RabbitMQ (`docker compose ps`) et que **orders-service** est bien démarré.
- **401 sur le front** : se reconnecter ; l’API ne fournit pas de refresh token : un seul `access_token` JWT.
- **CORS** : l’API active `enableCors()` largement ; en cas de front sur un autre hôte, ajuster si besoin dans `src/main.ts`.

---

## 11. Documentation technique du dépôt

Les conventions détaillées du projet API (versions d’URI, Prisma, Swagger) sont rappelées dans le fichier `.cursorrules` à la racine du dépôt.
