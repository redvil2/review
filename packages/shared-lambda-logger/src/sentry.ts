import * as Sentry from '@sentry/serverless';
import { load } from 'ts-dotenv';

const { SENTRY_DSN_BACKEND } = load({
  SENTRY_DSN_BACKEND: {
    type: String,
    optional: true,
  },
});

if (SENTRY_DSN_BACKEND) {
  Sentry.AWSLambda.init({
    dsn: SENTRY_DSN_BACKEND,
  });
}

export const wrapHandler = SENTRY_DSN_BACKEND
  ? Sentry.AWSLambda.wrapHandler
  : handler => handler;
