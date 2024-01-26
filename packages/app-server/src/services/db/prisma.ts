import { PrismaClient } from '@app/prisma';
import { load } from 'ts-dotenv';

const { DATABASE_CREDENTIALS, DATABASE_URL } = load({
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

const dbUrl = DATABASE_CREDENTIALS
  ? dbUrlFromCredentialsString(DATABASE_CREDENTIALS)
  : DATABASE_URL;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

export const prismaResetCachedPlan = async () => {
  // ToDo maybe find a better solution
  // Workaround for "cached plan must not change result type" exception
  return prisma.$executeRawUnsafe('DISCARD PLANS');
};

function dbUrlFromCredentialsString(DATABASE_CREDENTIALS: string) {
  const { dbname, password, engine, port, host, username } =
    JSON.parse(DATABASE_CREDENTIALS);
  return `${engine}://${encodeURIComponent(username)}:${encodeURIComponent(
    password,
  )}@${encodeURIComponent(host)}:${port}/${encodeURIComponent(
    dbname,
  )}?schema=public`;
}
