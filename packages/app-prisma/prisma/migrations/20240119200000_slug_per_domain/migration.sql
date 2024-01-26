DROP INDEX public."orders_slug_key";
CREATE UNIQUE INDEX "orders_qr_domain_name_id_slug_idx" ON "public"."orders"("qr_domain_name_id","slug");
