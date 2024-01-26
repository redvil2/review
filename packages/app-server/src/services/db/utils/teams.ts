import { Team } from '@app/prisma';
import { TRPCError } from '@trpc/server';

import { prisma } from '../prisma';

export const ensureTeamExists = async (id: number) => {
  const team = await prisma.team.findUnique({ where: { id } });

  if (!team) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Team not found' });
  }

  return team;
};

export const deleteTeamWithData = async (team: Team) => {
  await Promise.all([
    prisma.access.deleteMany({ where: { receivingTeamId: team.id } }),
    prisma.invitation.deleteMany({ where: { teamId: team.id } }),
    prisma.teamMembership.deleteMany({ where: { teamId: team.id } }),
  ]);
  await prisma.team.delete({ where: { id: team.id } });
};
