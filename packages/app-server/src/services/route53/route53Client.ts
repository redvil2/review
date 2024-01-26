import { Route53Client } from '@aws-sdk/client-route-53';
import { load } from 'ts-dotenv';

const { AWS_REGION } = load({
  AWS_REGION: String,
});

export const route53Client = new Route53Client({
  region: AWS_REGION,
});
