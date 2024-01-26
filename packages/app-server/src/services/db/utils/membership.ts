import { TeamMembershipRole, TeamMembershipStatus } from '@app/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { prisma } from '../prisma';

import { PublicUserSelect } from './user';

export const TeamMembershipSchema = z.object({
  id: z.number(),
  description: z.string().min(1).max(64).optional().nullable(),
  teamId: z.number(),
  userId: z.number(),
  team: z.object({
    id: z.number(),
  }),
  user: z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    userSettings: z
      .object({
        position: z.string().nullable(),
      })
      .nullable(),
  }),
  role: z.nativeEnum(TeamMembershipRole),
  status: z.nativeEnum(TeamMembershipStatus),
});

export const teamMembershipSelect = {
  id: true,
  description: true,
  teamId: true,
  userId: true,
  team: {
    select: {
      id: true,
    },
  },
  user: {
    select: PublicUserSelect,
  },
  role: true,
  status: true,
};

export const ensureHasMembership = async (teamId: number, userId: number) => {
  const teamMembership = await prisma.teamMembership.findFirst({
    where: { teamId, userId, status: 'ACTIVE' },
  });

  if (!teamMembership) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Forbidden',
    });
  }
};

export const ensureMembershipIsNotDuplicate = async (
  teamId: number,
  userId: number,
) => {
  const teamMembership = await prisma.teamMembership.findFirst({
    where: { teamId, userId },
  });

  if (teamMembership) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Membership exists (id: ${teamMembership.id})`,
    });
  }
};

export const ensureMembershipRole = async (
  teamId: number,
  userId: number,
  roles: TeamMembershipRole[],
) => {
  const teamMembership = await prisma.teamMembership.findFirst({
    where: { teamId, userId, status: 'ACTIVE', role: { in: roles } },
  });

  if (!teamMembership) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden' });
  }

  return teamMembership;
};

export const ensureTeamMembershipExists = async (id: number) => {
  const teamMembership = await prisma.teamMembership.findUnique({
    where: { id },
    select: teamMembershipSelect,
  });

  if (!teamMembership) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Team membership not found',
    });
  }

  return teamMembership;
};

export const getUserTeamIds = async (userId: number) => {
  return await prisma.teamMembership
    .findMany({
      where: { userId, status: 'ACTIVE' },
      select: { teamId: true },
    })
    .then(teams => teams.map(team => team.teamId));
};
