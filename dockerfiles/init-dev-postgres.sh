#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
   CREATE DATABASE app OWNER postgres;
EOSQL

echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf

pg_ctl restart -D /var/lib/postgresql/data
