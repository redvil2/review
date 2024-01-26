import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { load } from 'ts-dotenv';

const { GENERATOR_SNS_RESULT_TOPIC_ARN } = load({
  GENERATOR_SNS_RESULT_TOPIC_ARN: {
    type: String,
    optional: true,
  },
});

const sns = new SNSClient();

export async function reportResult(message: { externalId; bucketName; key }) {
  if (GENERATOR_SNS_RESULT_TOPIC_ARN) {
    await sns.send(
      new PublishCommand({
        TopicArn: GENERATOR_SNS_RESULT_TOPIC_ARN,
        Message: JSON.stringify(message),
      }),
    );
  } else {
    console.log(JSON.stringify(message));
  }
}
