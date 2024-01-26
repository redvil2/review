import { Pool } from 'pg';
import { load } from 'ts-dotenv';

function dbUrlFromCredentialsString(DATABASE_CREDENTIALS: string) {
  const { dbname, password, engine, port, host, username } =
    JSON.parse(DATABASE_CREDENTIALS);
  return `${engine}://${encodeURIComponent(username)}:${encodeURIComponent(
    password,
  )}@${encodeURIComponent(host)}:${port}/${encodeURIComponent(
    dbname,
  )}?schema=public`;
}

const { DATABASE_URL, DATABASE_CREDENTIALS } = load({
  DATABASE_URL: {
    type: String,
    optional: true,
  },
  DATABASE_CREDENTIALS: {
    type: String,
    optional: true,
  },
});

if (!DATABASE_CREDENTIALS && !DATABASE_URL) {
  throw new Error('DATABASE_CREDENTIALS or DATABASE_URL is required');
}

const connectionString = DATABASE_CREDENTIALS
  ? dbUrlFromCredentialsString(DATABASE_CREDENTIALS)
  : DATABASE_URL;

export const pool = new Pool({
  connectionString,
});
