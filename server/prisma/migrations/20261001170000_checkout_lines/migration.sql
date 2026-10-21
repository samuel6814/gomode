-- Local goods and CJ specials can share one paid order.

ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";
ALTER TABLE "CartItem" ALTER COLUMN "productId" DROP NOT NULL;
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CartItem" ADD COLUMN "lineKey" TEXT;
UPDATE "CartItem" SET "lineKey" = 'buyy:' || "productId" WHERE "lineKey" IS NULL AND "productId" IS NOT NULL;
ALTER TABLE "CartItem" ALTER COLUMN "lineKey" SET NOT NULL;
ALTER TABLE "CartItem" ADD COLUMN "cjVariantId" TEXT;
ALTER TABLE "CartItem" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'buyy';

DROP INDEX "CartItem_cartId_productId_key";
CREATE UNIQUE INDEX "CartItem_cartId_lineKey_key" ON "CartItem"("cartId", "lineKey");
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cjVariantId_fkey" FOREIGN KEY ("cjVariantId") REFERENCES "CjVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Order" ADD COLUMN "cjOrderId" TEXT;
ALTER TABLE "Order" ADD COLUMN "cjStatus" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "logisticName" TEXT;
ALTER TABLE "Order" ADD COLUMN "trackingNumber" TEXT;
ALTER TABLE "Order" ADD COLUMN "trackingUrl" TEXT;
ALTER TABLE "Order" ADD COLUMN "trackingEmailed" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";
ALTER TABLE "OrderItem" ALTER COLUMN "productId" DROP NOT NULL;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD COLUMN "cjVariantId" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'buyy';
ALTER TABLE "OrderItem" ADD COLUMN "vid" TEXT;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_cjVariantId_fkey" FOREIGN KEY ("cjVariantId") REFERENCES "CjVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
