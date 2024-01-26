import { DomainName, Prisma } from '@app/prisma';
import { TRPCError } from '@trpc/server';
import { isEqual, sortBy } from 'lodash';
import { customAlphabet } from 'nanoid';
import { load } from 'ts-dotenv';

import { createCertificate, describeCertificate } from '../../../services/acm';
import {
  createHostedZone,
  setCertificateValidationRecord,
  setDnsAlias,
} from '../../../services/route53';
import { resolveCnameSafely, resolveNsSafely } from '../../dns';
import { addCertificateToListener } from '../../elbv2/addCertificateToListener';
import { describeLoadBalancer } from '../../elbv2/describeLoadBalancer';
import { getHttpsListener } from '../../elbv2/getHttpsListener';
import { prisma } from '../prisma';

const {
  REDIRECT_CUSTOM_CNAME_ZONE_ID,
  REDIRECT_CUSTOM_CNAME_SUFFIX,
  REDIRECT_ALB_ARN,
} = load({
  REDIRECT_CUSTOM_CNAME_ZONE_ID: String,
  REDIRECT_CUSTOM_CNAME_SUFFIX: String,
  REDIRECT_ALB_ARN: String,
});

const generateCnamePrefix = customAlphabet('abcdefghijklmnopqrstuvwxyz', 12);

export const generateCnameRecord = () =>
  `${generateCnamePrefix()}.${REDIRECT_CUSTOM_CNAME_SUFFIX}`;

export const ensureUsableDomainName = async (
  domainNameId: number,
  userId: number,
) => {
  const domainName = await prisma.domainName.findUniqueOrThrow({
    where: {
      id: domainNameId,
    },
  });

  if (domainName.ownerId !== userId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Domain name does not belong to user',
    });
  }

  if (domainName.status !== 'VERIFIED') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Domain name is not verified',
    });
  }
};

export async function verifyDomainNameOwnership(domainName: DomainName) {
  if (domainName.type == 'ROOT') {
    const values = await resolveNsSafely(domainName.value);

    return isEqual(sortBy(values), sortBy(domainName.nameServers));
  } else {
    if (!domainName.cnameRecord) {
      return false;
    }

    const values = await resolveCnameSafely(domainName.value);

    return values.includes(domainName.cnameRecord);
  }
}

export async function verifyDomainNameCertificate(domainName: DomainName) {
  if (
    !domainName.validationRecordName ||
    !domainName.validationRecordValue ||
    !domainName.certificateArn
  ) {
    return false;
  }

  if (domainName?.validationRecordType != 'CNAME') {
    throw new Error(
      `Unknown verification type: ${domainName?.validationRecordType} (${domainName.value})`,
    );
  }

  const values = await resolveCnameSafely(domainName.validationRecordName);

  const valid = values.some(
    x =>
      normalizeDomainName(x) ==
      normalizeDomainName(domainName.validationRecordValue),
  );

  if (!valid) {
    return false;
  }

  const certificate = await describeCertificate(domainName.certificateArn);

  if (!certificate) {
    throw new Error(
      `Could not find certificate ${domainName.certificateArn} (domain ${domainName.id})`,
    );
  }

  return certificate.ready;
}

function normalizeDomainName(domainName?: string | null) {
  return domainName?.replace(/\.$/, '');
}

export async function setupDomainName(domainName: DomainName) {
  const { arn, record } = await createCertificate(domainName.value);

  const domainNamePatch: Prisma.DomainNameUpdateInput = {
    cnameRecord: generateCnameRecord(),
    hostedZoneId: null as string | null,
    nameServers: [] as string[],
    validationRecordName: record.Name,
    validationRecordType: record.Type,
    validationRecordValue: record.Value,
    certificateArn: arn,
  };

  if (domainName.type == 'ROOT') {
    const { id: hostedZoneId, nameServers } = await createHostedZone(
      domainName.value,
    );

    domainNamePatch.hostedZoneId = hostedZoneId;
    domainNamePatch.nameServers = nameServers;

    await setCertificateValidationRecord(hostedZoneId, record);
  }

  return domainNamePatch;
}

export async function routeDomainName(domainName: DomainName) {
  const httpsListener = await getHttpsListener(REDIRECT_ALB_ARN);

  if (!httpsListener) {
    throw new Error(`No HTTPS listener found on ${REDIRECT_ALB_ARN}`);
  }

  const [loadBalancer] = await Promise.all([
    describeLoadBalancer(REDIRECT_ALB_ARN),
    addCertificateToListener(
      httpsListener.ListenerArn,
      domainName.certificateArn,
    ),
  ]);

  if (!loadBalancer) {
    throw new Error(`No load balancer found on ${REDIRECT_ALB_ARN}`);
  }

  if (!loadBalancer.dnsName) {
    throw new Error(`Load balancer ${REDIRECT_ALB_ARN} has no DNS name`);
  }

  if (!loadBalancer.zoneId) {
    throw new Error(`Load balancer ${REDIRECT_ALB_ARN} has no zone ID`);
  }

  if (domainName.type === 'ROOT') {
    if (!domainName.hostedZoneId) {
      throw new Error(`No hosted zone found for ${domainName.id}`);
    }

    await setDnsAlias({
      zoneId: domainName.hostedZoneId,
      name: domainName.value,
      targetDnsName: loadBalancer.dnsName,
      targetZoneId: loadBalancer.zoneId,
    });
  } else {
    if (!domainName.cnameRecord) {
      throw new Error(
        `Cannot route domain name ${domainName.id} without CNAME record`,
      );
    }

    await setDnsAlias({
      zoneId: REDIRECT_CUSTOM_CNAME_ZONE_ID,
      name: domainName.cnameRecord,
      targetDnsName: loadBalancer.dnsName,
      targetZoneId: loadBalancer.zoneId,
    });
  }
}
