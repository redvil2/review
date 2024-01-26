import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { prisma } from '../../services/db/prisma';
import {
  TeamMembershipSchema,
  teamMembershipSelect,
  ensureHasMembership,
  ensureMembershipIsNotDuplicate,
  ensureMembershipRole,
  ensureTeamExists,
  ensureTeamMembershipExists,
  ensureUserExists,
} from '../../services/db/utils';
import { protectedProcedure, routerFactory } from '../trpc';

const TeamMembershipCreateInput = TeamMembershipSchema.omit({
  id: true,
  user: true,
  team: true,
}).extend({
  role: z.enum(['MANAGER', 'EDITOR', 'VIEWER']),
});

const TeamMembershipUpdateInput = TeamMembershipSchema.partial()
  .extend({ id: z.number() })
  .omit({ teamId: true, userId: true, user: true, team: true });

const TeamMembershipOutput = z.object({
  teamMembership: TeamMembershipSchema,
});

const TeamMembershipsOutput = z.object({
  teamMemberships: z.array(TeamMembershipSchema),
});

export const membershipRouter = routerFactory({
  create: protectedProcedure
    .input(TeamMembershipCreateInput)
    .output(TeamMembershipOutput)
    .mutation(async ({ input, ctx }) => {
      await ensureTeamExists(input.teamId);
      await ensureMembershipRole(input.teamId, ctx.auth.userId, [
        'OWNER',
        'MANAGER',
      ]);
      await ensureMembershipIsNotDuplicate(input.teamId, input.userId);

      const teamMembership = await prisma.teamMembership.create({
        data: {
          description: input.description,
          teamId: input.teamId,
          role: input.role,
          status: input.status,
          userId: input.userId,
        },
        select: teamMembershipSelect,
      });

      await prisma.invitation.create({
        data: {
          teamId: input.teamId,
          type: 'TEAM',
          invitingUserId: ctx.auth.userId,
          invitedUserId: input.userId,
          membershipRole: input.role,
          status: 'ACCEPTED',
          acceptedAt: new Date(),
        },
      });

      return { teamMembership };
    }),

  update: protectedProcedure
    .input(TeamMembershipUpdateInput)
    .output(TeamMembershipOutput)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateInput } = input;
      const teamMembership = await ensureTeamMembershipExists(id);
      await ensureMembershipRole(teamMembership.team.id, ctx.auth.userId, [
        'OWNER',
        'MANAGER',
      ]);

      if (teamMembership.role === 'OWNER') {
        await ensureMembershipRole(teamMembership.teamId, ctx.auth.userId, [
          'OWNER',
        ]);
        if (updateInput.role !== 'OWNER') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Ownership can`t be removed and must be transferred instead',
          });
        }
      }

      if (teamMembership.role !== 'OWNER' && updateInput.role === 'OWNER') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Team can only have one owner',
        });
      }

      const updatedTeamMembership = await prisma.teamMembership.update({
        where: { id },
        data: updateInput,
        select: teamMembershipSelect,
      });

      return { teamMembership: updatedTeamMembership };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const teamMembership = await ensureTeamMembershipExists(input.id);
      await ensureMembershipRole(teamMembership.team.id, ctx.auth.userId, [
        'OWNER',
        'MANAGER',
      ]);

      if (teamMembership.role === 'OWNER') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ownership can`t be removed and must be transferred instead',
        });
      }

      await prisma.teamMembership.delete({ where: { id: input.id } });

      return { success: true };
    }),

  transferOwnership: protectedProcedure
    .input(z.object({ teamId: z.number(), targetUserId: z.number() }))
    .output(TeamMembershipOutput)
    .mutation(async ({ input, ctx }) => {
      await ensureTeamExists(input.teamId);

      const ownerTeamMembership = await ensureMembershipRole(
        input.teamId,
        ctx.auth.userId,
        ['OWNER'],
      );

      await ensureUserExists(input.targetUserId);

      const updatedTeamMembership = await prisma.teamMembership.update({
        where: { id: ownerTeamMembership.id },
        data: { userId: input.targetUserId },
        select: teamMembershipSelect,
      });

      return { teamMembership: updatedTeamMembership };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(TeamMembershipOutput)
    .query(async ({ input, ctx }) => {
      const teamMembership = await ensureTeamMembershipExists(input.id);
      await ensureHasMembership(teamMembership.team.id, ctx.auth.userId);

      return { teamMembership };
    }),

  listOwn: protectedProcedure
    .output(TeamMembershipsOutput)
    .query(async ({ ctx }) => {
      return {
        teamMemberships: await prisma.teamMembership.findMany({
          where: { userId: ctx.auth.userId },
          select: teamMembershipSelect,
        }),
      };
    }),

  listByTeamId: protectedProcedure
    .input(z.object({ teamId: z.number() }))
    .output(TeamMembershipsOutput)
    .query(async ({ input, ctx }) => {
      await ensureTeamExists(input.teamId);
      await ensureHasMembership(input.teamId, ctx.auth.userId);

      return {
        teamMemberships: await prisma.teamMembership.findMany({
          where: { teamId: input.teamId },
          select: teamMembershipSelect,
        }),
      };
    }),
});
