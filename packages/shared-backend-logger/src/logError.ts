import { reportErrorToSentry, sentryEnabled } from './sentry';

function defaultErrorReporter(err, ctx) {
  console.error(err, ctx);
}

export const logError = sentryEnabled
  ? reportErrorToSentry
  : defaultErrorReporter;
