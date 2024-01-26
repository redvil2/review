import { AddListenerCertificatesCommand } from '@aws-sdk/client-elastic-load-balancing-v2';

import { elbv2Client } from './elbv2Client';

export async function addCertificateToListener(listenerArn, certificateArn) {
  await elbv2Client.send(
    new AddListenerCertificatesCommand({
      ListenerArn: listenerArn,
      Certificates: [
        {
          CertificateArn: certificateArn,
        },
      ],
    }),
  );
}
