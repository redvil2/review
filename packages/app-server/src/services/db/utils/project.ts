import { Access, Order, Prisma, Project } from '@app/prisma';
import { TRPCError } from '@trpc/server';
import { last, orderBy } from 'lodash';
import { extension } from 'mime-types';
import { load } from 'ts-dotenv';

import { parseDataURI } from '../../../utils/parseDataURI';
import { s3GetObject, s3RemoveFile, s3UploadBuffer } from '../../s3';
import { prisma } from '../prisma';

const { REDIRECT_DEFAULT_DOMAIN, AWS_S3_BUCKET_GENERATOR_ASSETS } = load({
  REDIRECT_DEFAULT_DOMAIN: String,
  AWS_S3_BUCKET_GENERATOR_ASSETS: String,
});

type ProjectWithOrders = Project & { orders: Order[] };
type ProjectWithLastOrderInfo<T extends ProjectWithOrders> = T & {
  lastOrderUrl: string | null;
};
export const ensureProjectExists = async (id: number) => {
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
  }

  return project;
};

export const ensureProjectExistsWithRelations = async (
  id: number,
  include: Prisma.ProjectInclude,
) => {
  const project = await prisma.project.findUnique({ where: { id }, include });

  if (!project) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
  }

  return project;
};

export const ensureProjectExistsWithOrders = async (id: number) => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { orders: true },
  });

  if (!project) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
  }

  return project;
};

export const ensureProjectOwner = async (project: Project, userId: number) => {
  const access = await prisma.access.findFirst({
    where: { projectId: project.id, receivingUserId: userId, isOwner: true },
  });

  if (!access) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Forbidden',
    });
  }

  return access;
};

export const ensureProjectWriteAccess = async (
  project: Project,
  userId: number,
) => {
  const [access] = (await prisma.$queryRaw`
    SELECT *
    FROM accesses
    WHERE project_id = ${project.id}
      AND access_type = 'WRITE'
      AND (receiving_user_id = ${userId}
        OR receiving_team_id IN (
          SELECT team_id
          FROM team_memberships
          WHERE role IN ('OWNER', 'EDITOR')
            AND status = 'ACTIVE'
            AND user_id = ${userId}
        )
      )
  `) as Access[];

  if (!access) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Forbidden',
    });
  }

  return access;
};

export const toProjectWithLastOrderInfo = <T extends ProjectWithOrders>(
  project: T,
): ProjectWithLastOrderInfo<T> => {
  const lastOrderUrl = last(project.orders)?.targetUrl ?? null;

  return { ...project, lastOrderUrl };
};

export const deleteProjectWithData = async (project: Project) => {
  const [logos, orders] = await Promise.all([
    prisma.qrLogo.findMany({
      where: { projectId: project.id },
    }),
    prisma.order.findMany({
      where: { projectId: project.id },
    }),
  ]);

  await Promise.all([
    prisma.access.deleteMany({
      where: { projectId: project.id },
    }),
    ...logos.map(async file => {
      const { s3Bucket, s3Key } = file;
      if (s3Key !== null) {
        await s3RemoveFile({ s3Bucket, s3Key });
      }
      await prisma.qrLogo.delete({ where: { id: file.id } });
    }),
    prisma.order.deleteMany({ where: { projectId: project.id } }),
  ]);

  await prisma.project.delete({
    where: { id: project.id },
  });
};

export async function getProjectLogo(project: Project) {
  return prisma.qrLogo.findFirst({
    where: { projectId: project.id },
  });
}

export async function getProjectImage(project: Project) {
  const logo = await prisma.qrLogo.findFirst({
    where: { projectId: project.id },
  });

  if (!logo || !logo.s3Bucket || !logo.s3Key) {
    return;
  }

  const body = await s3GetObject({
    s3Bucket: logo.s3Bucket,
    s3Key: logo.s3Key,
  });

  if (!body) {
    return;
  }

  const data = await body.transformToByteArray();

  return Buffer.from(data);
}

export async function getShortUrlDomainName(project: Project) {
  if (!project.qrDomainNameId) {
    return REDIRECT_DEFAULT_DOMAIN;
  }

  const domainName = await prisma.domainName.findUniqueOrThrow({
    where: { id: project.qrDomainNameId },
  });

  if (domainName.status !== 'VERIFIED') {
    throw new Error(
      `Project ${project.id} has unverified domain name ${domainName.id}`,
    );
  }

  return domainName.value;
}

export async function uploadProjectLogo(
  userId: number,
  projectId: number,
  logoDataURI: string,
) {
  const { contentType, data } = parseDataURI(logoDataURI);

  if (!contentType.startsWith('image/')) {
    throw new TRPCError({
      code: 'UNPROCESSABLE_CONTENT',
      message: 'Logo must be an image',
    });
  }

  const ext = extension(contentType);

  if (!ext) {
    throw new TRPCError({
      code: 'UNPROCESSABLE_CONTENT',
      message: 'Unsupported content type',
    });
  }

  const s3Bucket = AWS_S3_BUCKET_GENERATOR_ASSETS;

  const draftLogo = await prisma.qrLogo.create({
    data: { userId, projectId, s3Bucket, type: ext },
  });

  const s3Key = `user-${userId}/qr-logos/${draftLogo.id}.${extension(
    contentType,
  )}`;

  try {
    await s3UploadBuffer({
      Bucket: s3Bucket,
      Key: s3Key,
      Body: data,
    });
  } catch (error) {
    await prisma.qrLogo.delete({ where: { id: draftLogo.id } });
    throw error;
  }

  return prisma.qrLogo.update({
    where: { id: draftLogo.id },
    data: { s3Key },
  });
}

export function sortByLastOrder<T>(projects: T): T {
  return orderBy(
    projects as (Project & { orders: Order[] })[],
    p =>
      orderBy(p.orders, o => o.createdAt, 'desc')[0]?.createdAt ?? p.createdAt,
    'desc',
  ) as T;
}
