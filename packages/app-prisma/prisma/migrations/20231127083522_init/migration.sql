-- CreateEnum
CREATE TYPE "language" AS ENUM ('ENGLISH', 'CHINESE', 'GERMAN', 'FRENCH', 'SPANISH', 'DANISH', 'ITALIAN', 'PORTUGUESE', 'ROMANIAN', 'TURKISH');

-- CreateEnum
CREATE TYPE "company_type" AS ENUM ('LABEL_CUSTOMER', 'PRINT_PROVIDER', 'SOLUTION_PROVIDER', 'OTHER');

-- CreateEnum
CREATE TYPE "team_type" AS ENUM ('B2B', 'SOLUTION_PROVIDER', 'PRINT_PROVIDER');

-- CreateEnum
CREATE TYPE "team_membership_role" AS ENUM ('OWNER', 'MANAGER', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "team_membership_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "invitation_status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "invitation_type" AS ENUM ('TEAM', 'PROJECT');

-- CreateEnum
CREATE TYPE "access_scope" AS ENUM ('PROJECT', 'ORDER');

-- CreateEnum
CREATE TYPE "access_type" AS ENUM ('READ', 'WRITE');

-- CreateEnum
CREATE TYPE "access_receiver_type" AS ENUM ('USER', 'TEAM');

-- CreateEnum
CREATE TYPE "printing_method" AS ENUM ('OFFSET', 'FLEXO', 'DIGITAL', 'FLEXO_INKJET');

-- CreateEnum
CREATE TYPE "shape" AS ENUM ('SQUARE', 'ROUND');

-- CreateEnum
CREATE TYPE "project_type" AS ENUM ('QR');

-- CreateEnum
CREATE TYPE "qr_type" AS ENUM ('SINGLE', 'SERIAL');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('IDLE', 'PROCESSING');

-- CreateEnum
CREATE TYPE "domain_name_status" AS ENUM ('VERIFICATION_PENDING', 'VERIFIED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "mobile_phone" TEXT,
    "email" TEXT,
    "wechat_id" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "company_name" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" SERIAL NOT NULL,
    "onboard" BOOLEAN NOT NULL DEFAULT true,
    "onboard_extended" BOOLEAN NOT NULL DEFAULT true,
    "language" "language" NOT NULL DEFAULT 'CHINESE',
    "country" VARCHAR NOT NULL,
    "company_type" "company_type",
    "position" VARCHAR,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "initiator_user_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "team_type" NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_memberships" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "team_membership_role" NOT NULL,
    "status" "team_membership_status" NOT NULL DEFAULT 'ACTIVE',
    "description" VARCHAR(64),
    "team_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "team_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "recipient_number" VARCHAR,
    "recipient_email" VARCHAR,
    "token" VARCHAR,
    "membership_role" "team_membership_role" NOT NULL DEFAULT 'VIEWER',
    "status" "invitation_status" NOT NULL DEFAULT 'PENDING',
    "type" "invitation_type" NOT NULL,
    "access_type" "access_type" NOT NULL DEFAULT 'WRITE',
    "expires_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "accepted_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "team_id" INTEGER,
    "project_id" INTEGER,
    "inviting_user_id" INTEGER NOT NULL,
    "invited_user_id" INTEGER,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accesses" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "further_sharing" BOOLEAN NOT NULL DEFAULT false,
    "access_scope" "access_scope" NOT NULL,
    "access_type" "access_type" NOT NULL,
    "receiver_type" "access_receiver_type" NOT NULL,
    "project_id" INTEGER NOT NULL,
    "order_id" INTEGER,
    "giving_user_id" INTEGER NOT NULL,
    "receiving_user_id" INTEGER,
    "receiving_team_id" INTEGER,

    CONSTRAINT "accesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_codes" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipient_number" VARCHAR NOT NULL,

    CONSTRAINT "sms_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "article" TEXT,
    "label" TEXT,
    "label_customer" TEXT,
    "print_provider" TEXT,
    "type" "project_type" NOT NULL DEFAULT 'QR',
    "qr_type" "qr_type" NOT NULL,
    "printing_method" "printing_method" NOT NULL,
    "color" TEXT NOT NULL,
    "bg_color" TEXT,
    "shape" "shape" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "qr_domain_name_id" INTEGER,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_label" TEXT NOT NULL,
    "order_id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL DEFAULT secure_id(6),
    "target_url" TEXT,
    "fallback_url" TEXT,
    "amount" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "status" "order_status" NOT NULL DEFAULT 'IDLE',
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "qr_domain_name_id" INTEGER,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "s3_bucket" TEXT NOT NULL,
    "s3_key" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "order_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "project_id" INTEGER,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_logos" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "s3_bucket" TEXT NOT NULL,
    "s3_key" TEXT,
    "type" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "project_id" INTEGER,

    CONSTRAINT "qr_logos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domain_names" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_used_at" TIMESTAMP(3),
    "value" TEXT NOT NULL,
    "status" "domain_name_status" NOT NULL DEFAULT 'VERIFICATION_PENDING',
    "owner_id" INTEGER,

    CONSTRAINT "domain_names_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_wechat_id_key" ON "users"("wechat_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_wechat_id_idx" ON "users"("wechat_id");

-- CreateIndex
CREATE INDEX "users_mobile_phone_idx" ON "users"("mobile_phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE INDEX "contacts_user_id_idx" ON "contacts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_user_id_initiator_user_id_key" ON "contacts"("user_id", "initiator_user_id");

-- CreateIndex
CREATE INDEX "teams_name_idx" ON "teams"("name");

-- CreateIndex
CREATE INDEX "team_memberships_team_id_idx" ON "team_memberships"("team_id");

-- CreateIndex
CREATE INDEX "team_memberships_user_id_idx" ON "team_memberships"("user_id");

-- CreateIndex
CREATE INDEX "invitations_team_id_idx" ON "invitations"("team_id");

-- CreateIndex
CREATE INDEX "invitations_project_id_idx" ON "invitations"("project_id");

-- CreateIndex
CREATE INDEX "invitations_inviting_user_id_idx" ON "invitations"("inviting_user_id");

-- CreateIndex
CREATE INDEX "invitations_invited_user_id_idx" ON "invitations"("invited_user_id");

-- CreateIndex
CREATE INDEX "invitations_status_idx" ON "invitations"("status");

-- CreateIndex
CREATE INDEX "invitations_token_idx" ON "invitations"("token");

-- CreateIndex
CREATE INDEX "accesses_project_id_idx" ON "accesses"("project_id");

-- CreateIndex
CREATE INDEX "accesses_giving_user_id_idx" ON "accesses"("giving_user_id");

-- CreateIndex
CREATE INDEX "accesses_receiving_user_id_idx" ON "accesses"("receiving_user_id");

-- CreateIndex
CREATE INDEX "accesses_receiving_team_id_idx" ON "accesses"("receiving_team_id");

-- CreateIndex
CREATE INDEX "idx_createdat" ON "sms_codes"("created_at");

-- CreateIndex
CREATE INDEX "projects_user_id_idx" ON "projects"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_slug_key" ON "orders"("slug");

-- CreateIndex
CREATE INDEX "orders_project_id_idx" ON "orders"("project_id");

-- CreateIndex
CREATE INDEX "files_project_id_idx" ON "files"("project_id");

-- CreateIndex
CREATE INDEX "files_order_id_idx" ON "files"("order_id");

-- CreateIndex
CREATE INDEX "files_user_id_idx" ON "files"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "qr_logos_project_id_key" ON "qr_logos"("project_id");

-- CreateIndex
CREATE INDEX "qr_logos_project_id_idx" ON "qr_logos"("project_id");

-- CreateIndex
CREATE INDEX "qr_logos_user_id_idx" ON "qr_logos"("user_id");

-- CreateIndex
CREATE INDEX "domain_names_value_idx" ON "domain_names"("value");

-- CreateIndex
CREATE INDEX "domain_names_owner_id_idx" ON "domain_names"("owner_id");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_initiator_user_id_fkey" FOREIGN KEY ("initiator_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_inviting_user_id_fkey" FOREIGN KEY ("inviting_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_user_id_fkey" FOREIGN KEY ("invited_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesses" ADD CONSTRAINT "accesses_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesses" ADD CONSTRAINT "accesses_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesses" ADD CONSTRAINT "accesses_giving_user_id_fkey" FOREIGN KEY ("giving_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesses" ADD CONSTRAINT "accesses_receiving_user_id_fkey" FOREIGN KEY ("receiving_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesses" ADD CONSTRAINT "accesses_receiving_team_id_fkey" FOREIGN KEY ("receiving_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_qr_domain_name_id_fkey" FOREIGN KEY ("qr_domain_name_id") REFERENCES "domain_names"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_qr_domain_name_id_fkey" FOREIGN KEY ("qr_domain_name_id") REFERENCES "domain_names"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_logos" ADD CONSTRAINT "qr_logos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_logos" ADD CONSTRAINT "qr_logos_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domain_names" ADD CONSTRAINT "domain_names_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
