import { CreateHostedZoneCommand } from '@aws-sdk/client-route-53';
import { nanoid } from 'nanoid';

import { route53Client } from './route53Client';

export async function createHostedZone(domainName: string) {
  const result = await route53Client.send(
    new CreateHostedZoneCommand({
      Name: domainName,
      CallerReference: nanoid(16),
    }),
  );

  return {
    id: result.HostedZone?.Id as string,
    nameServers: result.DelegationSet?.NameServers ?? [],
  };
}
