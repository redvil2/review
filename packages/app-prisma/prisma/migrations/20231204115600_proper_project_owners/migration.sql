ALTER TABLE "public"."accesses" ADD COLUMN "is_owner" boolean NOT NULL DEFAULT 'FALSE';

INSERT INTO "public"."accesses"("created_at", "updated_at", "further_sharing", "access_scope", "access_type", "receiver_type", "project_id", "giving_user_id", "receiving_user_id", "is_owner")
SELECT CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'TRUE', 'PROJECT', 'WRITE', 'USER', id, user_id, user_id, 'TRUE'
FROM projects;
