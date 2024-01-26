import {
  sentryEnabled,
  requestHandler,
  errorHandler,
} from '@app/shared-backend-logger';
import cookieParser from 'cookie-parser';
import express from 'express';

import { health } from './routes/health';
import { redirect } from './routes/redirect';

export const app = express();

if (sentryEnabled) {
  app.use(requestHandler);
}

app.set('trust proxy', true);

app.use(cookieParser());

app.get('/livez', health);
app.get('/readyz', health);

app.get('/:slug', redirect);
app.get('/:slug/:serial', redirect);

if (sentryEnabled) {
  app.use(errorHandler);
}
