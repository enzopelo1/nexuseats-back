-- CreateEnum
CREATE TYPE "CuisineType" AS ENUM ('FRENCH', 'ITALIAN', 'JAPANESE', 'CHINESE', 'INDIAN', 'MEXICAN', 'AMERICAN', 'MEDITERRANEAN', 'THAI', 'OTHER');

-- CreateTable
CREATE TABLE "restaurants" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "cuisine" "CuisineType" NOT NULL,
    "address" VARCHAR(200) NOT NULL,
    "countryCode" VARCHAR(5) NOT NULL,
    "localNumber" VARCHAR(15) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averagePrice" DECIMAL(10,2) NOT NULL,
    "deliveryTime" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "imageUrl" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "restaurantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" VARCHAR(500),
    "available" BOOLEAN NOT NULL DEFAULT true,
    "menuId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToMenuItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToMenuItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "restaurants_cuisine_idx" ON "restaurants"("cuisine");

-- CreateIndex
CREATE INDEX "restaurants_rating_idx" ON "restaurants"("rating");

-- CreateIndex
CREATE INDEX "menus_restaurantId_idx" ON "menus"("restaurantId");

-- CreateIndex
CREATE INDEX "menu_items_menuId_idx" ON "menu_items"("menuId");

-- CreateIndex
CREATE INDEX "menu_items_available_idx" ON "menu_items"("available");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE INDEX "_CategoryToMenuItem_B_index" ON "_CategoryToMenuItem"("B");

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMenuItem" ADD CONSTRAINT "_CategoryToMenuItem_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMenuItem" ADD CONSTRAINT "_CategoryToMenuItem_B_fkey" FOREIGN KEY ("B") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
