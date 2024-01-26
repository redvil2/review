import { S3Client } from '@aws-sdk/client-s3';
import { load } from 'ts-dotenv';

const { AWS_REGION } = load({ AWS_REGION: String });

export const s3Client = new S3Client({
  region: AWS_REGION,
});
