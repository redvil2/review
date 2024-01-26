import http from 'http';

import { WebSocketServer } from 'ws';

import { createWSSHandler } from '../trpc/websockets';

import { app } from './app';

export const server = http.createServer(app);

const wss = new WebSocketServer({ server });
const handler = createWSSHandler(wss);

export function cleanUp() {
  handler.broadcastReconnectNotification();
  wss.close();
}
