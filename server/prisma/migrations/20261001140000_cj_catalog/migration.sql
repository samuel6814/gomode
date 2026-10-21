-- CreateTable
CREATE TABLE "CjAuth" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "accessTokenExpiryDate" TIMESTAMP(3) NOT NULL,
    "refreshTokenExpiryDate" TIMESTAMP(3) NOT NULL,
    "openId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CjAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CjProduct" (
    "id" TEXT NOT NULL,
    "pid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "categoryName" TEXT NOT NULL DEFAULT '',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY['cj']::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CjProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CjVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "vid" TEXT NOT NULL,
    "sku" TEXT NOT NULL DEFAULT '',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "optionLabel" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CjVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CjProduct_pid_key" ON "CjProduct"("pid");

-- CreateIndex
CREATE INDEX "CjProduct_isActive_idx" ON "CjProduct"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "CjVariant_productId_vid_key" ON "CjVariant"("productId", "vid");

-- AddForeignKey
ALTER TABLE "CjVariant" ADD CONSTRAINT "CjVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "CjProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
