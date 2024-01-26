CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION encode_urlsafe_base64(binary_data bytea)
RETURNS text AS $$
    SELECT translate(
    	TRIM(TRAILING '=' FROM encode(binary_data, 'base64'))
    		, '=+/', '._-') 
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION secure_id(random_size int)
RETURNS text AS $$
    SELECT encode_urlsafe_base64(gen_random_bytes(random_size))
$$ LANGUAGE SQL;
