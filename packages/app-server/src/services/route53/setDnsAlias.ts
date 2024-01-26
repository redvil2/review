import { ChangeResourceRecordSetsCommand } from '@aws-sdk/client-route-53';

import { route53Client } from './route53Client';

export type SetDnsAliasInput = {
  zoneId: string;
  name: string;
  targetDnsName: string;
  targetZoneId: string;
};

export async function setDnsAlias({
  zoneId,
  name,
  targetDnsName,
  targetZoneId,
}: SetDnsAliasInput) {
  await route53Client.send(
    new ChangeResourceRecordSetsCommand({
      HostedZoneId: zoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: 'UPSERT',
            ResourceRecordSet: {
              Name: name,
              Type: 'A',
              AliasTarget: {
                DNSName: targetDnsName,
                HostedZoneId: targetZoneId,
                EvaluateTargetHealth: false,
              },
            },
          },
        ],
      },
    }),
  );
}
