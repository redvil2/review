import { createPool } from 'slonik';
import { load } from 'ts-dotenv';

const { ANALYTICS_DATABASE_URL } = load({
  ANALYTICS_DATABASE_URL: String,
});

export const promisedAnalyticsPool = createPool(ANALYTICS_DATABASE_URL);
