-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "plu" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stocks" (
    "id" SERIAL NOT NULL,
    "quantityOnShelf" INTEGER NOT NULL,
    "quantityOnOrder" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,

    CONSTRAINT "Stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shops" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Shops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_plu_key" ON "Products"("plu");

-- AddForeignKey
ALTER TABLE "Stocks" ADD CONSTRAINT "Stocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stocks" ADD CONSTRAINT "Stocks_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
