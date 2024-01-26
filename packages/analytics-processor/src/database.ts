import { Pool } from 'pg';
import { load } from 'ts-dotenv';

const { ANALYTICS_DATABASE_URL } = load({
  ANALYTICS_DATABASE_URL: String,
});

export const pool = new Pool({
  connectionString: ANALYTICS_DATABASE_URL,
});
