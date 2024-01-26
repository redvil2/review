import { DomainNameType, DomainNameStatus } from '@app/prisma';
import { z } from 'zod';

import { prisma } from '../../services/db';
import {
  routeDomainName,
  setupDomainName,
  verifyDomainNameCertificate,
  verifyDomainNameOwnership,
} from '../../services/db/utils';
import { protectedProcedure, routerFactory } from '../trpc';

export const DomainNameAvailabilitySchema = z.object({
  domainName: z.string(),
  isAvailable: z.boolean(),
  cause: z.string().optional(),
});

export const DomainNameAvailabilityQueryInput = z.object({
  domainName: z.string(),
});

export const DomainNameSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastUsedAt: z.date().nullable(),

  value: z.string(),
  status: z.nativeEnum(DomainNameStatus),

  ownerId: z.number().nullable(),
});

export const domainNameRouter = routerFactory({
  create: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(DomainNameType),
        value: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return prisma.$transaction(
        async tx => {
          const draftDomainName = await tx.domainName.create({
            data: {
              type: input.type,
              value: input.value,
              status: DomainNameStatus.VERIFICATION_PENDING,
              ownerId: ctx.auth.userId,
            },
          });

          const patch = await setupDomainName(draftDomainName);

          const domainName = await tx.domainName.update({
            where: { id: draftDomainName.id },
            data: patch,
          });

          return { domainName };
        },
        { timeout: 15000 },
      );
    }),

  verify: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const domainName = await prisma.domainName.findFirstOrThrow({
        where: {
          id: input.id,
          ownerId: ctx.auth.userId,
        },
      });

      if (domainName.status == DomainNameStatus.VERIFIED) {
        return {
          ownershipVerified: true,
          certificateVerified: true,
        };
      }

      const [ownershipVerified, certificateVerified] = await Promise.all([
        verifyDomainNameOwnership(domainName),
        verifyDomainNameCertificate(domainName),
      ]);

      if (ownershipVerified && certificateVerified) {
        await prisma.domainName.update({
          where: { id: domainName.id },
          data: {
            status: DomainNameStatus.VERIFIED,
          },
        });
      }

      try {
        // TODO: move to background job
        await routeDomainName(domainName);
      } catch (err) {
        // Not using a transaction to get a psuedo mutex lock
        await prisma.domainName.update({
          where: { id: domainName.id },
          data: {
            status: domainName.status,
          },
        });

        throw err;
      }

      return {
        ownershipVerified,
        certificateVerified,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const domainName = await prisma.domainName.findFirstOrThrow({
        where: {
          id: input.id,
          ownerId: ctx.auth.userId,
        },
      });

      return { domainName };
    }),

  listOwn: protectedProcedure.query(async ({ ctx }) => {
    const domainNames = await prisma.domainName.findMany({
      where: { ownerId: ctx.auth.userId },
      orderBy: { lastUsedAt: 'desc' },
    });

    return { domainNames };
  }),
});
