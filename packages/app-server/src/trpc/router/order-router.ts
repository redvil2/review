import { OrderStatus } from '@app/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  ensureHourlySerialRateLimit,
  ensureIsNotLastOrder,
  ensureOrderExistsWithChildren,
  ensureProjectExists,
  ensureProjectExistsWithOrders,
  ensureProjectWriteAccess,
  ensureUserHasProjectAccess,
  getQrOptions,
  getSerialOrderAmount,
} from '../../services/db/utils';
import {
  GENERATOR_REQUESTS_ENABLED,
  publishRequest,
} from '../../services/generator/publishRequest';
import { qrEncode } from '../../services/generator/qrEncode';
import { s3GetPresignedUrl } from '../../services/s3';
import { protectedProcedure, routerFactory } from '../trpc';

import { DomainNameSchema } from './domain-name-router';

export const OrderSchema = z.object({
  id: z.number(),
  projectId: z.number().nonnegative(),
  targetUrl: z.string().url().nullable(),
  fallbackUrl: z.string().url().nullable(),
  orderLabel: z.string().min(1),
  amount: z.number().nonnegative(),
  status: z.nativeEnum(OrderStatus),
  qrDomainName: DomainNameSchema.nullable().optional(),
  qrCodesProgress: z.number().min(0).max(100).nullable(),
});

const OrderCreateInput = OrderSchema.pick({
  projectId: true,
  targetUrl: true,
  fallbackUrl: true,
  orderLabel: true,
  amount: true,
});

const OrderUpdateInput = OrderSchema.pick({
  targetUrl: true,
  fallbackUrl: true,
  orderLabel: true,
})
  .partial()
  .extend({
    id: z.number(),
  });

const OrderOutput = z.object({
  order: OrderSchema,
});

const OrdersOutput = z.object({
  orders: z.array(OrderSchema),
});

const OrderNextIdInput = z.object({ projectId: z.number().nonnegative() });

const OrderNextIdOutput = z.object({ nextOrderId: z.number().nonnegative() });

export const orderRouter = routerFactory({
  create: protectedProcedure
    .input(OrderCreateInput)
    .output(OrderOutput)
    .mutation(async ({ input, ctx }) => {
      const project = await ensureProjectExists(input.projectId);
      await ensureUserHasProjectAccess(ctx.auth.userId, project, 'WRITE');

      if (project.qrType === 'SERIAL') {
        await ensureHourlySerialRateLimit(ctx.auth.userId, input.amount);
      }

      const maxOrderId = await ctx.prisma.order.aggregate({
        where: {
          projectId: input.projectId,
        },
        _max: {
          orderId: true,
        },
      });

      const nextOrderId = maxOrderId._max.orderId
        ? maxOrderId._max.orderId + 1
        : 1;

      const order = await ctx.prisma.order.create({
        data: {
          targetUrl: input.targetUrl,
          fallbackUrl: input.fallbackUrl,
          orderLabel: input.orderLabel,
          orderId: nextOrderId,
          amount: input.amount,
          projectId: input.projectId,
          userId: ctx.auth.userId,
          status: project.qrType === 'SERIAL' ? 'PROCESSING' : 'IDLE',
        },
        include: {
          qrDomainName: true,
        },
      });

      if (project.qrType === 'SERIAL' && GENERATOR_REQUESTS_ENABLED) {
        const { url, ...options } = await getQrOptions(order, project);

        await publishRequest({
          ...options,
          shortUrl: url,
          amount: getSerialOrderAmount(order),
          externalId: order.id,
          outputPath: `project-${project.id}/order-${order.id}.zip`,
        });
      }

      return { order };
    }),

  update: protectedProcedure
    .input(OrderUpdateInput)
    .output(OrderOutput)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const order = await ensureOrderExistsWithChildren(input.id);
      await ensureUserHasProjectAccess(ctx.auth.userId, order.project, 'WRITE');

      const updatedOrder = await ctx.prisma.order.update({
        where: { id },
        data,
        include: {
          qrDomainName: true,
        },
      });

      return { order: updatedOrder };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const order = await ensureOrderExistsWithChildren(input.id);
      await ensureUserHasProjectAccess(ctx.auth.userId, order.project, 'WRITE');
      await ensureIsNotLastOrder(order.projectId);

      await ctx.prisma.order.delete({ where: { id: order.id } });

      return { success: true };
    }),

  nextId: protectedProcedure
    .input(OrderNextIdInput)
    .output(OrderNextIdOutput)
    .query(async ({ input, ctx }) => {
      const project = await ensureProjectExists(input.projectId);
      await ensureProjectWriteAccess(project, ctx.auth.userId);

      const maxOrderId = await ctx.prisma.order.aggregate({
        where: {
          projectId: input.projectId,
        },
        _max: {
          orderId: true,
        },
      });

      const nextOrderId = maxOrderId._max.orderId
        ? maxOrderId._max.orderId + 1
        : 1;

      return { nextOrderId };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(OrderOutput)
    .query(async ({ input, ctx }) => {
      const order = await ensureOrderExistsWithChildren(input.id);
      await ensureUserHasProjectAccess(ctx.auth.userId, order.project, 'READ');

      return { order };
    }),

  createDownloadLink: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const order = await ensureOrderExistsWithChildren(input.id);
      await ensureUserHasProjectAccess(ctx.auth.userId, order.project, 'READ');

      if (order.project.qrType === 'SERIAL') {
        if (order.qrCodesBucketName && order.qrCodesKey) {
          const { url } = await s3GetPresignedUrl({
            s3Bucket: order.qrCodesBucketName,
            s3Key: order.qrCodesKey,
          });

          return url;
        }

        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Not found (generation in progress?)',
        });
      }

      const options = await getQrOptions(order, order.project);

      const buffer = await qrEncode(options);

      return `data:image/png;base64,${buffer.toString('base64')}`;
    }),

  list: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .output(OrdersOutput)
    .query(async ({ input, ctx }) => {
      const project = await ensureProjectExistsWithOrders(input.projectId);
      await ensureUserHasProjectAccess(ctx.auth.userId, project, 'READ');
      const orders = await ctx.prisma.order.findMany({
        where: { projectId: input.projectId },
        include: {
          qrDomainName: true,
        },
      });

      return { orders };
    }),
});
