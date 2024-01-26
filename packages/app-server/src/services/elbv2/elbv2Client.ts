import { ElasticLoadBalancingV2Client } from '@aws-sdk/client-elastic-load-balancing-v2';
import { load } from 'ts-dotenv';

const { AWS_REGION } = load({
  AWS_REGION: String,
});

export const elbv2Client = new ElasticLoadBalancingV2Client({
  region: AWS_REGION,
});
