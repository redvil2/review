import { Order, Project } from '@app/prisma';
import { TRPCError } from '@trpc/server';
import { load } from 'ts-dotenv';

import { prisma } from '../prisma';

import {
  ensureProjectExistsWithOrders,
  getProjectLogo,
  getShortUrlDomainName,
} from './project';

const { SERIAL_AMOUNT_PER_HOUR } = load({
  SERIAL_AMOUNT_PER_HOUR: {
    type: Number,
    optional: true,
    default: 10000,
  },
});

export const ensureOrderExists = async (id: number) => {
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
  }

  return order;
};

export const ensureOrderExistsWithChildren = async (id: number) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      project: true,
      qrDomainName: true,
    },
  });

  if (!order) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
  }

  return order;
};

export const ensureIsNotLastOrder = async (projectId: number) => {
  const project = await ensureProjectExistsWithOrders(projectId);

  if (project.orders.length === 1) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'To remove last order, remove project instead',
    });
  }
};

export async function getShortUrl(order: Order, project: Project) {
  const domainName = await getShortUrlDomainName(project);

  return `https://${domainName}/${order.slug}`;
}

export async function getQrOptions(order: Order, project: Project) {
  const [url, logo] = await Promise.all([
    getShortUrl(order, project),
    getProjectLogo(project),
  ]);

  return {
    url,
    imageBucket: logo?.s3Bucket,
    imageKey: logo?.s3Key,
    styling: {
      shape: project.shape,
      foreground: project.color,
      background: project.bgColor ?? undefined,
    },
    format: 'png',
  };
}

export async function ensureHourlySerialRateLimit(
  userId: number,
  currentAmount: number,
) {
  const hourlyRequestSum = await prisma.order.aggregate({
    where: {
      userId: userId,
      project: {
        qrType: 'SERIAL',
      },
      createdAt: {
        gte: new Date(Date.now() - 1000 * 60 * 60),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const newAmount = currentAmount + (hourlyRequestSum._sum.amount ?? 0);

  if (newAmount > SERIAL_AMOUNT_PER_HOUR) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Only up to ${SERIAL_AMOUNT_PER_HOUR} QRs allowed per hour.`,
    });
  }
}

export function getSerialOrderAmount(order: Order) {
  return Math.ceil(order.amount * 1.1);
}
