import { ResourceRecord } from '@aws-sdk/client-acm';
import { ChangeResourceRecordSetsCommand } from '@aws-sdk/client-route-53';

import { route53Client } from './route53Client';

export async function setCertificateValidationRecord(
  hostedZoneId: string,
  record: ResourceRecord,
) {
  await route53Client.send(
    new ChangeResourceRecordSetsCommand({
      HostedZoneId: hostedZoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: 'CREATE',
            ResourceRecordSet: {
              Name: record.Name,
              Type: record.Type,
              ResourceRecords: [
                {
                  Value: record.Value,
                },
              ],
              TTL: 300,
            },
          },
        ],
      },
    }),
  );
}
