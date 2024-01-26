import { DescribeCertificateCommand } from '@aws-sdk/client-acm';

import { acmClient } from './acmClient';

export async function describeCertificate(arn) {
  const { Certificate } = await acmClient.send(
    new DescribeCertificateCommand({
      CertificateArn: arn,
    }),
  );

  if (!Certificate) {
    return;
  }

  return {
    ready: Certificate?.Status == 'ISSUED',
  };
}
