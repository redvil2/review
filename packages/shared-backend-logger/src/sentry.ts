import * as Sentry from '@sentry/node';
import { load } from 'ts-dotenv';

const { SENTRY_DSN_BACKEND } = load({
  SENTRY_DSN_BACKEND: {
    type: String,
    optional: true,
  },
});

if (SENTRY_DSN_BACKEND) {
  Sentry.init({
    dsn: SENTRY_DSN_BACKEND,
  });
}

export const sentryEnabled = !!SENTRY_DSN_BACKEND;

type ErrorContext = {
  request;
  auth?: {
    userId?: number | null;
  };
  extra?;
};

export function reportErrorToSentry(err, ctx: ErrorContext) {
  Sentry.withScope(scope => {
    scope.addEventProcessor(event => {
      return Sentry.addRequestDataToEvent(event, ctx.request);
    });

    if (ctx.auth?.userId) {
      scope.setUser({
        id: ctx.auth.userId,
      });
    }

    if (ctx.extra) {
      scope.setExtras(ctx.extra);
    }

    Sentry.captureException(err);
  });
}

export const requestHandler = Sentry.Handlers.requestHandler();
export const errorHandler = Sentry.Handlers.errorHandler();
