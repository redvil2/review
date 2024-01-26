import { load } from 'ts-dotenv';

import { cleanUp, server } from './http/server';

const { HOST, PORT } = load({
  HOST: String,
  PORT: Number,
});

server.listen(PORT, () => {
  console.log(`[ ready ] http://${HOST}:${PORT}`);
  console.log(`[ websocket ready ] ws://${HOST}:${PORT}`);
});

process.on('SIGTERM', () => {
  cleanUp();
  process.exit();
});
