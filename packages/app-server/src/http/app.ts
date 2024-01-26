import {
  sentryEnabled,
  requestHandler,
  errorHandler,
} from '@app/shared-backend-logger';
import cors from 'cors';
import express from 'express';

import { installMiddleware } from '../trpc';

import { wechatVerifyHandler } from './routes/wechat';

export const app = express();

if (sentryEnabled) {
  app.use(requestHandler);
}

app.use(cors({ origin: true, credentials: true }));

const healthCheck = (req, res) => res.send({ ok: true });

app.get('/', healthCheck);
app.get('/health', healthCheck);
app.get('/wechat', wechatVerifyHandler);

installMiddleware(app);

if (sentryEnabled) {
  app.use(errorHandler);
}
