import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { load } from 'ts-dotenv';

import { lookupIPLocation } from '../utils/lookupIPLocation';
import { parseBrowserName } from '../utils/parseBrowserName';

const { AWS_REGION, REDIRECT_SNS_NOTIFICATION_ARN } = load({
  AWS_REGION: String,
  REDIRECT_SNS_NOTIFICATION_ARN: {
    type: String,
    optional: true,
  },
});

const snsClient = new SNSClient({
  region: AWS_REGION,
});

type PublishVisitNotificationInput = {
  orderId: number;
  serialNumber?: string;
  ipAddress: string;
  userAgent?: string;
  returning: boolean;
  visitedAt: Date;
};

export async function publishVisitNotification(
  input: PublishVisitNotificationInput,
) {
  if (!REDIRECT_SNS_NOTIFICATION_ARN) {
    return;
  }

  const processed = {
    orderId: input.orderId,
    serialNumber: input.serialNumber,
    browserName: input.userAgent ? parseBrowserName(input.userAgent) : null,
    returning: input.returning,
    visitedAt: input.visitedAt,
    ...lookupIPLocation(input.ipAddress),
  };

  await snsClient.send(
    new PublishCommand({
      TopicArn: REDIRECT_SNS_NOTIFICATION_ARN,
      Message: JSON.stringify(processed),
    }),
  );
}
