import { wrapHandler } from '@app/shared-lambda-logger';
import type { SQSHandler } from 'aws-lambda';
import { load } from 'ts-dotenv';

import { runGenerator } from './generator/runGenerator';
import { createGeneratorTask } from './process/createGeneratorTask';

const { LAMBDA_GENERATION_MAX_AMOUNT } = load({
  LAMBDA_GENERATION_MAX_AMOUNT: {
    type: Number,
    optional: true,
    default: 100,
  },
});

export const handler: SQSHandler = wrapHandler(async (event): Promise<void> => {
  if (event.Records.length > 1) {
    throw new Error('Only one record is supported');
  }

  const data = JSON.parse(event.Records[0].body);

  if (data.amount <= LAMBDA_GENERATION_MAX_AMOUNT) {
    await runGenerator(data);
  } else {
    await createGeneratorTask(data);
  }
});
