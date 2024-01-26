import { DescribeListenersCommand } from '@aws-sdk/client-elastic-load-balancing-v2';

import { elbv2Client } from './elbv2Client';

export async function getHttpsListener(loadBalancerArn) {
  const existingListeners = await elbv2Client.send(
    new DescribeListenersCommand({
      LoadBalancerArn: loadBalancerArn,
    }),
  );

  return existingListeners.Listeners?.find(listener => listener.Port === 443);
}
