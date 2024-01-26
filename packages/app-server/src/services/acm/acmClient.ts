import { ACMClient } from '@aws-sdk/client-acm';
import { load } from 'ts-dotenv';

const { AWS_REGION } = load({
  AWS_REGION: String,
});

export const acmClient = new ACMClient({
  region: AWS_REGION,
});
