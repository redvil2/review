import { load } from 'ts-dotenv';

import { app } from './app';

const { REDIRECT_PORT } = load({
  REDIRECT_PORT: {
    type: Number,
    default: 80,
  },
});

app.listen(REDIRECT_PORT);
