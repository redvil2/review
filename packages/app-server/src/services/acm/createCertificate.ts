import {
  RequestCertificateCommand,
  DescribeCertificateCommand,
} from '@aws-sdk/client-acm';

import { acmClient } from './acmClient';

export async function createCertificate(domainName: string) {
  const createdCertificate = await acmClient.send(
    new RequestCertificateCommand({
      DomainName: domainName,
      ValidationMethod: 'DNS',
    }),
  );

  for (let i = 0; i < 10; i++) {
    const { Certificate } = await acmClient.send(
      new DescribeCertificateCommand({
        CertificateArn: createdCertificate.CertificateArn,
      }),
    );

    const dnsValidation = Certificate?.DomainValidationOptions?.find(
      x => x.ValidationMethod == 'DNS',
    );

    if (dnsValidation?.ResourceRecord) {
      return {
        arn: createdCertificate.CertificateArn as string,
        record: dnsValidation.ResourceRecord,
      };
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error(
    `Malformed certificate creation: no DNS validation record (${createdCertificate.CertificateArn})`,
  );
}
