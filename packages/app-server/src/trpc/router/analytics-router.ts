import { omit } from 'lodash';
import { z } from 'zod';

import {
  getOrderVisits,
  getVisitsSegmentation,
  getUserTypeSegmentation,
  getBrowserSegmentation,
  getCitySegmentation,
  getOrderVisitsInWindow,
  getOrderVisitsInPrevWindow,
  getScanAppSegmentation,
  countUniqueSerialNumbers,
} from '../../services/analytics';
import { findSerialNumbers } from '../../services/analytics/findSerialNumbers';
import { promisedAnalyticsPool } from '../../services/analytics/pool';
import {
  ensureOrderExistsWithChildren,
  ensureUserHasProjectAccess,
  getSerialOrderAmount,
} from '../../services/db/utils';
import { protectedProcedure, routerFactory, trpc } from '../trpc';

const useAnalyticsDatabase = trpc.middleware(async ({ next, ctx }) => {
  const pool = await promisedAnalyticsPool;

  return next({
    ctx: {
      ...ctx,
      analyticsConnection: pool,
    },
  });
});

const procedures = {
  project: protectedProcedure
    .use(useAnalyticsDatabase)
    .input(
      z.object({
        projectId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { projectId } = input;

      const project = await ctx.prisma.project.findUniqueOrThrow({
        where: { id: projectId },
        include: { orders: true },
      });

      await ensureUserHasProjectAccess(
        ctx.auth.userId as number,
        project,
        'READ',
      );

      return Promise.all(
        project.orders.map(async order => {
          return {
            orderId: order.id,
            visits: await getOrderVisits(ctx.analyticsConnection, order.id),
          };
        }),
      );
    }),

  order: protectedProcedure
    .use(useAnalyticsDatabase)
    .input(
      z.object({
        orderId: z.number(),
        periodUnit: z.enum(['HOUR', 'DAY', 'WEEK', 'MONTH']),
        periodLength: z.number().positive(),
      }),
    )
    .output(
      z.object({
        dummyData: z.boolean(),
        amount: z.number(),
        projectQrType: z.enum(['SERIAL', 'SINGLE']),
        visitsCurrWindow: z.number(),
        visitsPrevWindow: z.number(),
        serialsSegmentation: z
          .array(
            z.object({
              key: z.enum(['used', 'unused', 'unusable']),
              count: z.number(),
            }),
          )
          .nullable(),
        visitsSegmentation: z.array(
          z.object({
            key: z.string(),
            count: z.number(),
          }),
        ),
        scanAppSegmentation: z.array(
          z.object({
            key: z.enum(['camera', 'wechat']),
            count: z.number(),
          }),
        ),
        userTypeSegmentation: z.array(
          z.object({
            key: z.enum(['new', 'returning']),
            count: z.number(),
          }),
        ),
        browserSegmentation: z.array(
          z.object({
            key: z.string().nullable(),
            count: z.number(),
          }),
        ),
        citySegmentation: z.array(
          z.object({
            key: z.string().nullable(),
            count: z.number(),
          }),
        ),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { orderId, periodUnit: period, periodLength: length } = input;

      const order = await ensureOrderExistsWithChildren(orderId);

      await ensureUserHasProjectAccess(
        ctx.auth.userId as number,
        order.project,
        'READ',
      );

      const [
        visitsCurrWindow,
        visitsPrevWindow,
        uniqueSerialNumbersCount,
        visitsSegmentation,
        scanAppSegmentation,
        userTypeSegmentation,
        browserSegmentation,
        citySegmentation,
      ] = await Promise.all([
        getOrderVisitsInWindow(
          ctx.analyticsConnection,
          orderId,
          period,
          length,
        ),
        getOrderVisitsInPrevWindow(
          ctx.analyticsConnection,
          orderId,
          period,
          length,
        ),
        order.project.qrType == 'SERIAL'
          ? countUniqueSerialNumbers(ctx.analyticsConnection, orderId)
          : null,
        getVisitsSegmentation(ctx.analyticsConnection, orderId, period, length),
        getScanAppSegmentation(
          ctx.analyticsConnection,
          orderId,
          period,
          length,
        ),
        getUserTypeSegmentation(
          ctx.analyticsConnection,
          orderId,
          period,
          length,
        ),
        getBrowserSegmentation(
          ctx.analyticsConnection,
          orderId,
          period,
          length,
        ),
        getCitySegmentation(ctx.analyticsConnection, orderId, period, length),
      ]);

      return {
        dummyData: false,
        amount:
          order.project.qrType == 'SERIAL'
            ? getSerialOrderAmount(order)
            : order.amount,
        projectQrType: order.project.qrType,
        visitsCurrWindow,
        visitsPrevWindow,
        serialsSegmentation:
          order.project.qrType == 'SERIAL'
            ? [
                {
                  key: 'used',
                  count: Math.min(order.amount, uniqueSerialNumbersCount),
                },
                {
                  key: 'unusable',
                  count: order.unusableAmount,
                },
                {
                  key: 'unused',
                  count:
                    order.amount -
                    order.unusableAmount -
                    Math.min(order.amount, uniqueSerialNumbersCount),
                },
              ]
            : null,
        visitsSegmentation,
        scanAppSegmentation,
        userTypeSegmentation,
        browserSegmentation,
        citySegmentation,
      };
    }),

  findSerialNumbers: protectedProcedure
    .use(useAnalyticsDatabase)
    .input(
      z.object({
        orderId: z.number(),
        scanType: z.enum(['SCANNED', 'UNSCANNED', 'BOTH']).optional(),
        searchQuery: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const order = await ensureOrderExistsWithChildren(input.orderId);
      await ensureUserHasProjectAccess(
        ctx.auth.userId as number,
        order.project,
        'WRITE',
      );

      const results = await findSerialNumbers(
        ctx.analyticsConnection,
        input.orderId,
        input.scanType ?? 'BOTH',
        input.searchQuery,
      );

      return {
        matchingAmount: results?.[0]?.matchingAmount ?? 0,
        results: results.map(x => omit(x, ['matchingAmount'])),
      };
    }),
};

export const analyticsRouter = routerFactory(procedures);
