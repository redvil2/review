import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { load } from 'ts-dotenv';

const { AWS_REGION, GENERATOR_REQUESTS_QUEUE_URL } = load({
  AWS_REGION: String,
  GENERATOR_REQUESTS_QUEUE_URL: {
    type: String,
    optional: true,
  },
});

const sqsClient = new SQSClient({
  region: AWS_REGION,
});

export type GeneratorRequest = {
  amount;
  externalId;
  outputPath;

  shortUrl;
  imageBucket;
  imageKey;
  styling;
  format;
};

export const GENERATOR_REQUESTS_ENABLED = !!GENERATOR_REQUESTS_QUEUE_URL;

export async function publishRequest(input: GeneratorRequest) {
  if (!GENERATOR_REQUESTS_ENABLED) {
    throw new Error('Generator requests are not enabled');
  }

  await sqsClient.send(
    new SendMessageCommand({
      QueueUrl: GENERATOR_REQUESTS_QUEUE_URL,
      MessageBody: JSON.stringify(input),
    }),
  );
}
