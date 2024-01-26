import { TeamType } from '@app/prisma';
import { z } from 'zod';

import { prisma, prismaResetCachedPlan } from '../../services/db/prisma';
import {
  deleteTeamWithData,
  ensureHasMembership,
  ensureMembershipRole,
  ensureTeamExists,
} from '../../services/db/utils';
import { protectedProcedure, routerFactory } from '../trpc';

export const TeamSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  type: z.nativeEnum(TeamType),
});

const TeamCreateInput = TeamSchema.omit({ id: true });

const TeamUpdateInput = TeamSchema.partial().extend({
  id: z.number(),
});

export const TeamOutput = z.object({ team: TeamSchema });

const TeamsOutput = z.object({
  teams: z.array(TeamSchema),
});

export const teamRouter = routerFactory({
  create: protectedProcedure
    .input(TeamCreateInput)
    .output(TeamOutput)
    .mutation(async ({ input, ctx }) => {
      const team = await prisma.team.create({
        data: {
          name: input.name,
          type: input.type,
        },
      });

      await prisma.teamMembership.create({
        data: {
          description: 'Owner',
          teamId: team.id,
          role: 'OWNER',
          status: 'ACTIVE',
          userId: ctx.auth.userId,
        },
      });

      if (team.id === 1) {
        await prismaResetCachedPlan();
      }

      return { team };
    }),

  update: protectedProcedure
    .input(TeamUpdateInput)
    .output(TeamOutput)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateInput } = input;
      await ensureTeamExists(id);
      await ensureMembershipRole(id, ctx.auth.userId, ['OWNER']);

      const updatedTeam = await prisma.team.update({
        where: { id },
        data: updateInput,
      });

      return { team: updatedTeam };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const team = await ensureTeamExists(input.id);
      await ensureMembershipRole(team.id, ctx.auth.userId, ['OWNER']);
      await deleteTeamWithData(team);

      return { success: true };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(TeamOutput)
    .query(async ({ input, ctx }) => {
      const team = await ensureTeamExists(input.id);
      await ensureHasMembership(input.id, ctx.auth.userId);

      return { team };
    }),

  list: protectedProcedure.output(TeamsOutput).query(async ({ ctx }) => {
    const teamMemberships = await prisma.teamMembership.findMany({
      where: { userId: ctx.auth.userId, status: 'ACTIVE' },
      include: { team: true },
    });

    return {
      teams: teamMemberships.map(membership => membership.team),
    };
  }),
});
