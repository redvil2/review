/*
  Warnings:

  - A unique constraint covering the columns `[cname_record]` on the table `domain_names` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[owner_id,value]` on the table `domain_names` will be added. If there are existing duplicate values, this will fail.

*/

-- CreateEnum
CREATE TYPE "domain_name_type" AS ENUM ('CNAME', 'ROOT');

-- AlterTable
ALTER TABLE "domain_names" ADD COLUMN     "certificate_arn" TEXT,
ADD COLUMN     "cname_record" TEXT,
ADD COLUMN     "hosted_zone_id" TEXT,
ADD COLUMN     "name_servers" TEXT[],
ADD COLUMN     "type" "domain_name_type" NOT NULL DEFAULT 'CNAME',
ADD COLUMN     "validation_record_name" TEXT,
ADD COLUMN     "validation_record_type" TEXT,
ADD COLUMN     "validation_record_value" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "domain_names_cname_record_key" ON "domain_names"("cname_record");

-- CreateIndex
CREATE UNIQUE INDEX "domain_names_owner_id_value_key" ON "domain_names"("owner_id", "value");
