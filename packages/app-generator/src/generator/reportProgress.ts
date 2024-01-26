import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { load } from 'ts-dotenv';

const { GENERATOR_SNS_PROGRESS_TOPIC_ARN } = load({
  GENERATOR_SNS_PROGRESS_TOPIC_ARN: {
    type: String,
    optional: true,
  },
});

const sns = new SNSClient();

export async function reportProgress(message: {
  externalId: unknown;
  progress: number;
  serialNumbers: string[];
}) {
  if (GENERATOR_SNS_PROGRESS_TOPIC_ARN) {
    await sns.send(
      new PublishCommand({
        TopicArn: GENERATOR_SNS_PROGRESS_TOPIC_ARN,
        Message: JSON.stringify(message),
      }),
    );
  } else {
    console.log(JSON.stringify(message));
  }
}
