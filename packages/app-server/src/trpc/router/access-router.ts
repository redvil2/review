import { AccessReceiverType, AccessScope, AccessType } from '@app/prisma';
import { z } from 'zod';

import { prisma } from '../../services/db';
import {
  ensureAccessExists,
  ensureAccessIsNotDuplicate,
  ensureIsGivingOrReceivingUser,
  ensureIsGivingUser,
  ensureProjectExists,
  ensureTeamExists,
  ensureUserExists,
  getProjectAccessTypeByUser,
  getUserTeamIds,
} from '../../services/db/utils';
import { protectedProcedure, routerFactory } from '../trpc';

import { ProjectSchema } from './project-router';
import { UserSchema } from './user-router';

const AccessSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  furtherSharing: z.boolean(),
  accessScope: z.nativeEnum(AccessScope),
  accessType: z.nativeEnum(AccessType),
  receiverType: z.nativeEnum(AccessReceiverType),
  projectId: z.number(),
  project: ProjectSchema.optional(),
  givingUserId: z.number(),
  givingUser: UserSchema.optional(),
  receivingUserId: z.number().nullable().optional(),
  receivingUser: UserSchema.optional().nullable(),
  receivingTeamId: z.number().nullable().optional(),
  receivingTeam: UserSchema.optional().nullable(),
});

const AccessCreateInput = AccessSchema.pick({
  accessType: true,
  projectId: true,
  receivingUserId: true,
  receivingTeamId: true,
}).refine(data => !!data.receivingTeamId !== !!data.receivingUserId, {
  message: 'Exactly one of receivingTeamId or receivingUserId must be filled',
});

const AccessUpdateInput = AccessSchema.pick({
  id: true,
  accessType: true,
  furtherSharing: true,
});

const AccessOutput = z.object({ access: AccessSchema });

const AccessesOutput = z.array(AccessSchema);

export const accessRouter = routerFactory({
  create: protectedProcedure
    .input(AccessCreateInput)
    .output(AccessOutput)
    .mutation(async ({ input, ctx }) => {
      const { projectId, receivingUserId, receivingTeamId } = input;
      if (receivingTeamId) {
        await ensureTeamExists(receivingTeamId);
      }
      if (receivingUserId) {
        await ensureUserExists(receivingUserId);
      }
      await ensureProjectExists(projectId);
      await ensureAccessIsNotDuplicate(
        projectId,
        null,
        receivingUserId,
        receivingTeamId,
      );
      const access = await prisma.access.create({
        data: {
          accessScope: projectId ? 'PROJECT' : 'ORDER',
          accessType: input.accessType,
          receiverType: receivingUserId ? 'USER' : 'TEAM',
          projectId,
          orderId: null,
          givingUserId: ctx.auth.userId,
          receivingUserId,
          receivingTeamId,
        },
      });

      return { access };
    }),

  update: protectedProcedure
    .input(AccessUpdateInput)
    .output(AccessOutput)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateInput } = input;
      const access = await ensureAccessExists(id);
      await ensureIsGivingUser(access, ctx.auth.userId);

      const updatedAccess = await prisma.access.update({
        where: { id },
        data: updateInput,
      });

      return { access: updatedAccess };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const access = await ensureAccessExists(input.id);
      await ensureIsGivingUser(access, ctx.auth.userId);

      await prisma.access.delete({ where: { id: input.id } });

      return { success: true };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(AccessOutput)
    .query(async ({ input, ctx }) => {
      const access = await ensureAccessExists(input.id);
      await ensureIsGivingOrReceivingUser(access, ctx.auth.userId);

      return { access };
    }),

  getByProjectId: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      const teamMemberships = await prisma.teamMembership.findMany({
        where: { userId: ctx.auth.userId, status: 'ACTIVE' },
      });

      return await getProjectAccessTypeByUser(
        input.projectId,
        ctx.auth.userId,
        teamMemberships,
      );
    }),

  listReceived: protectedProcedure
    .output(z.object({ personal: AccessesOutput, team: AccessesOutput }))
    .query(async ({ ctx }) => {
      const [personal, team] = await Promise.all([
        prisma.access.findMany({
          where: { receivingUserId: ctx.auth.userId as number },
        }),
        prisma.access.findMany({
          where: {
            receivingTeamId: { in: await getUserTeamIds(ctx.auth.userId) },
          },
        }),
      ]);

      return { personal, team };
    }),

  listGiven: protectedProcedure
    .output(z.object({ accesses: AccessesOutput }))
    .query(async ({ ctx }) => {
      const accesses = await prisma.access.findMany({
        where: { givingUserId: ctx.auth.userId },
      });

      return { accesses };
    }),

  listGivenByProjectId: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .output(z.object({ accesses: AccessesOutput }))
    .query(async ({ input, ctx }) => {
      const accesses = await prisma.access.findMany({
        where: {
          projectId: input.projectId,
          givingUserId: ctx.auth.userId,
        },
      });

      return { accesses };
    }),
});
