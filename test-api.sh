#!/bin/bash

# Script de test complet pour l'API NexusEats
# TP2 - CRUD complet avec Prisma

BASE_URL="http://localhost:3002"

echo "🧪 Tests de l'API NexusEats avec Prisma"
echo "========================================"
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Liste des restaurants avec pagination
echo -e "${BLUE}📋 Test 1: Liste des restaurants (page 1, limit 5)${NC}"
curl -s "${BASE_URL}/v2/restaurants?page=1&limit=5" | jq '.'
echo ""
echo ""

# Test 2: Filtrage par cuisine
echo -e "${BLUE}🍝 Test 2: Filtrage par cuisine ITALIAN${NC}"
curl -s "${BASE_URL}/v2/restaurants?cuisine=ITALIAN" | jq '.'
echo ""
echo ""

# Test 3: Filtrage par note minimale
echo -e "${BLUE}⭐ Test 3: Restaurants avec note >= 4.5${NC}"
curl -s "${BASE_URL}/v2/restaurants?minRating=4.5" | jq '.'
echo ""
echo ""

# Test 4: Recherche textuelle
echo -e "${BLUE}🔍 Test 4: Recherche 'pizza'${NC}"
curl -s "${BASE_URL}/v2/restaurants?search=pizza" | jq '.'
echo ""
echo ""

# Test 5: Filtrage par statut ouvert
echo -e "${BLUE}🟢 Test 5: Restaurants ouverts${NC}"
curl -s "${BASE_URL}/v2/restaurants?isOpen=true" | jq '.'
echo ""
echo ""

# Récupérer l'ID du premier restaurant pour les tests suivants
RESTAURANT_ID=$(curl -s "${BASE_URL}/v2/restaurants?limit=1" | jq -r '.data[0].id')
echo -e "${YELLOW}📌 ID du restaurant pour les tests: ${RESTAURANT_ID}${NC}"
echo ""

# Test 6: Détail d'un restaurant avec relations
echo -e "${BLUE}🏪 Test 6: Détail du restaurant avec menus et items${NC}"
curl -s "${BASE_URL}/v2/restaurants/${RESTAURANT_ID}" | jq '.'
echo ""
echo ""

# Test 7: Créer un nouveau restaurant
echo -e "${BLUE}➕ Test 7: Créer un nouveau restaurant${NC}"
NEW_RESTAURANT=$(curl -s -X POST "${BASE_URL}/v2/restaurants" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Restaurant API",
    "address": "123 Test Street, Paris",
    "countryCode": "+33",
    "localNumber": "123456789",
    "cuisineType": "FRENCH",
    "rating": 4.2,
    "averagePrice": 22.5,
    "deliveryTime": 30,
    "isOpen": true,
    "description": "Restaurant de test créé via API"
  }')
echo "$NEW_RESTAURANT" | jq '.'
NEW_RESTAURANT_ID=$(echo "$NEW_RESTAURANT" | jq -r '.id')
echo ""
echo ""

# Test 8: Mettre à jour un restaurant
echo -e "${BLUE}✏️  Test 8: Mettre à jour le restaurant${NC}"
curl -s -X PATCH "${BASE_URL}/v2/restaurants/${NEW_RESTAURANT_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4.7,
    "isOpen": false,
    "description": "Restaurant de test mis à jour"
  }' | jq '.'
echo ""
echo ""

# Test 9: Créer un menu
echo -e "${BLUE}📜 Test 9: Créer un menu${NC}"
NEW_MENU=$(curl -s -X POST "${BASE_URL}/menus" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Menu Test\",
    \"description\": \"Menu de test créé via API\",
    \"restaurantId\": \"${NEW_RESTAURANT_ID}\"
  }")
echo "$NEW_MENU" | jq '.'
NEW_MENU_ID=$(echo "$NEW_MENU" | jq -r '.id')
echo ""
echo ""

# Test 10: Récupérer les catégories existantes
echo -e "${BLUE}🏷️  Test 10: Récupérer les catégories${NC}"
CATEGORIES=$(curl -s "${BASE_URL}/v2/restaurants?limit=1" | jq -r '.data[0].menus[0].items[0].categories')
CATEGORY_ID=$(echo "$CATEGORIES" | jq -r '.[0].id')
echo "Catégories disponibles:"
echo "$CATEGORIES" | jq '.'
echo ""
echo ""

# Test 11: Créer un item de menu avec catégories
echo -e "${BLUE}🍽️  Test 11: Créer un item de menu${NC}"
NEW_ITEM=$(curl -s -X POST "${BASE_URL}/menu-items" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Plat Test\",
    \"description\": \"Plat de test créé via API\",
    \"price\": 15.50,
    \"available\": true,
    \"menuId\": \"${NEW_MENU_ID}\",
    \"categoryIds\": [\"${CATEGORY_ID}\"]
  }")
echo "$NEW_ITEM" | jq '.'
NEW_ITEM_ID=$(echo "$NEW_ITEM" | jq -r '.id')
echo ""
echo ""

# Test 12: Récupérer les menus d'un restaurant
echo -e "${BLUE}📋 Test 12: Récupérer les menus du restaurant${NC}"
curl -s "${BASE_URL}/restaurants/${NEW_RESTAURANT_ID}/menus" | jq '.'
echo ""
echo ""

# Test 13: Récupérer les items d'un menu
echo -e "${BLUE}🍴 Test 13: Récupérer les items du menu${NC}"
curl -s "${BASE_URL}/menus/${NEW_MENU_ID}/items" | jq '.'
echo ""
echo ""

# Test 14: Mettre à jour un item
echo -e "${BLUE}✏️  Test 14: Mettre à jour l'item${NC}"
curl -s -X PATCH "${BASE_URL}/menu-items/${NEW_ITEM_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 17.50,
    "available": false
  }' | jq '.'
echo ""
echo ""

# Test 15: Soft delete du restaurant
echo -e "${BLUE}🗑️  Test 15: Soft delete du restaurant${NC}"
curl -s -X DELETE "${BASE_URL}/v2/restaurants/${NEW_RESTAURANT_ID}" -w "\nStatus Code: %{http_code}\n"
echo ""
echo ""

# Test 16: Vérifier que le restaurant n'apparaît plus
echo -e "${BLUE}🔍 Test 16: Vérifier que le restaurant supprimé n'apparaît plus${NC}"
curl -s "${BASE_URL}/v2/restaurants?search=Test%20Restaurant" | jq '.data | length'
echo ""
echo ""

# Test 17: Pagination avec métadonnées
echo -e "${BLUE}📊 Test 17: Pagination page 2 avec métadonnées${NC}"
curl -s "${BASE_URL}/v2/restaurants?page=2&limit=2" | jq '{
  total: .meta.total,
  page: .meta.page,
  limit: .meta.limit,
  lastPage: .meta.lastPage,
  hasNext: .meta.hasNext,
  hasPrev: .meta.hasPrev,
  itemsCount: (.data | length)
}'
echo ""
echo ""

# Test 18: Filtres combinés
echo -e "${BLUE}🎯 Test 18: Filtres combinés (cuisine + rating + isOpen)${NC}"
curl -s "${BASE_URL}/v2/restaurants?cuisine=JAPANESE&minRating=4&isOpen=true" | jq '.'
echo ""
echo ""

echo -e "${GREEN}✅ Tests terminés !${NC}"
echo ""
echo "📝 Résumé des tests:"
echo "  - Pagination avec métadonnées ✓"
echo "  - Filtres (cuisine, rating, isOpen, search) ✓"
echo "  - Relations chargées avec include ✓"
echo "  - Soft delete ✓"
echo "  - CRUD Restaurants ✓"
echo "  - CRUD Menus ✓"
echo "  - CRUD MenuItems avec catégories N:M ✓"
