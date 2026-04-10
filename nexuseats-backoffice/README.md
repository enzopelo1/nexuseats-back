# NexusEats — Back-Office Admin

SPA React + Vite + TypeScript + shadcn/ui branchée sur l'API NestJS NexusEats (sprints 1→10).

## Démarrage

Le back-office est une appli **Vite** : tant que `npm run dev` ne tourne pas, **http://localhost:5174** renverra `ERR_CONNECTION_REFUSED` (normal).

```bash
cd nexuseats-backoffice
cp .env.example .env
npm install
npm run dev
```

Attendre la ligne du type `Local: http://localhost:5174/`, puis ouvrir cette URL dans le navigateur.

**Si le port 5174 est déjà pris** : arrêtez l’autre processus ou changez le port dans `vite.config.ts`.

Ouvrir **http://localhost:5174** — la **gestion des commandes** (statuts, détail des articles) se fait dans le menu **Commandes** (`/orders`), pas sur le front client.

## Identifiants de test (API / seed)
- **`admin@nexus.dev`** / `secret123` → rôle API `admin`, accès complet back-office.
- **`owner@nexus.dev`** / `secret123` → rôle API `owner`, affiché comme MANAGER dans l’UI ; peut aussi mettre à jour les statuts des commandes.

## Stack
- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (cache API)
- Zustand (auth)
- React Router v6
- Recharts (stats)

## Build production
```bash
npm run build
docker build -t nexuseats-backoffice .
docker run -p 8080:80 nexuseats-backoffice
```

## Modules
1. Auth JWT (login + refresh)
2. Dashboard KPI
3. Restaurants (CRUD)
4. Menus & Plats
5. Commandes temps réel
6. Utilisateurs & Rôles
7. Statistiques & exports
8. Paramètres
9. Monitoring (health checks)
