import { Pool } from 'pg';
import { load } from 'ts-dotenv';

const { DATABASE_URL } = load({
  DATABASE_URL: String,
});

export const pool = new Pool({
  connectionString: DATABASE_URL,
});
