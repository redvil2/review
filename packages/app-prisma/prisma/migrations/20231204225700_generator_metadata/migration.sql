ALTER TABLE "public"."orders"
  ADD COLUMN "qr_codes_bucket_name" text,
  ADD COLUMN "qr_codes_key" text,
  ADD COLUMN "qr_codes_progress" integer;
