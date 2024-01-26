import { DescribeLoadBalancersCommand } from '@aws-sdk/client-elastic-load-balancing-v2';

import { elbv2Client } from './elbv2Client';

export async function describeLoadBalancer(arn) {
  const result = await elbv2Client.send(
    new DescribeLoadBalancersCommand({
      LoadBalancerArns: [arn],
    }),
  );

  const [loadBalancer] = result.LoadBalancers || [];

  if (!loadBalancer) {
    return;
  }

  return {
    dnsName: loadBalancer.DNSName,
    zoneId: loadBalancer.CanonicalHostedZoneId,
  };
}
