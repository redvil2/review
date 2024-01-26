import { load } from 'ts-dotenv';

import { runGenerator } from './generator/runGenerator';

const { GENERATOR_REQUEST } = load({
  GENERATOR_REQUEST: String,
});

const request = JSON.parse(GENERATOR_REQUEST);

setImmediate(async () => {
  await runGenerator(request);
});
