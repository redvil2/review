import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { load } from 'ts-dotenv';

const { AWS_REGION, AWS_HOSTED_ZONE_DOMAIN } = load({
  AWS_REGION: String,
  AWS_HOSTED_ZONE_DOMAIN: String,
});
const sesClient = new SESClient({ region: AWS_REGION });

export function sendEmail({
  recipients,
  subject,
  body,
}: {
  recipients: string[];
  subject: string;
  body: string;
}): Promise<string | void> {
  const sendEmailCommand = new SendEmailCommand({
    Destination: {
      ToAddresses: recipients,
    },
    Message: {
      Body: {
        Text: { Data: body },
      },
      Subject: { Data: subject },
    },
    Source: `mail@${AWS_HOSTED_ZONE_DOMAIN}`,
  });

  return sesClient.send(sendEmailCommand).then(
    data => {
      return data.MessageId;
    },
    error => {
      console.error(error);
    },
  );
}
