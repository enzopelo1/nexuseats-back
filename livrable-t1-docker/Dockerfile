############################
# Stage 1 : builder
############################
FROM node:20-alpine AS builder

WORKDIR /app

# Dépendances système minimales (prisma + node-gyp éventuel)
RUN apk add --no-cache openssl libc6-compat python3 make g++ bash

# Copier les fichiers de config
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma
COPY src ./src

# Installer les dépendances complètes
RUN npm ci

# Générer le client Prisma
RUN npx prisma generate

# Build NestJS (dist/)
RUN npm run build


############################
# Stage 2 : production
############################
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Installer uniquement les dépendances de prod
COPY package*.json ./
RUN npm ci --only=production

# Copier le build et le schéma Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Port d'exposition (3002 comme en dev)
ENV PORT=3002
EXPOSE 3002

# Commande de démarrage
CMD ["node", "dist/main.js"]

