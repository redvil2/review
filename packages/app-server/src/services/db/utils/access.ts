import { Access, AccessType, Project, TeamMembership } from '@app/prisma';
import { TRPCError } from '@trpc/server';

import { prisma } from '../prisma';

import { ensureHasMembership } from './membership';
import { ensureOrderExists } from './order';
import { ensureProjectExists, ensureProjectExistsWithOrders } from './project';
import { PublicUserSelect } from './user';

export const ensureAccessExists = async (id: number) => {
  const access = await prisma.access.findUnique({
    where: { id },
    include: {
      givingUser: {
        select: PublicUserSelect,
      },
      receivingUser: {
        select: PublicUserSelect,
      },
    },
  });

  if (!access) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Access not found' });
  }

  return access;
};

export const ensureAccessIsNotDuplicate = async (
  projectId: number,
  orderId: number | null,
  receivingUserId?: number | null,
  receivingTeamId?: number | null,
) => {
  const access = await prisma.access.findFirst({
    where: {
      projectId,
      orderId,
      receivingUserId,
      receivingTeamId,
    },
  });

  if (access) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Access exists (id: ${access.id})`,
    });
  }
};

export const ensureIsNotGivingUser = async (
  givingUserId?: number | null,
  receivingUserId?: number | null,
) => {
  if (givingUserId === receivingUserId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Can not invite yourself',
    });
  }
};

export const ensureIsGivingUser = async (access: Access, userId: number) => {
  if (access.givingUserId != userId) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden' });
  }

  return access;
};

export const ensureIsGivingOrReceivingUser = async (
  access: Access,
  userId: number,
) => {
  if (access.givingUserId === userId) {
    return;
  }
  if (access.receivingTeamId)
    await ensureHasMembership(access.receivingTeamId, userId);
  if (access.receivingUserId == userId) {
    return;
  }
  throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden' });
};

export const getPersonalOverTeam = (
  personal: AccessType | null,
  teams: AccessType | null,
): AccessType | null => {
  return personal || teams;
};

export const getHighestAccessType = (
  projectAccessType: AccessType | null,
  orderAccessType: AccessType | null,
): AccessType | null => {
  if ([projectAccessType, orderAccessType].includes('WRITE')) return 'WRITE';
  if ([projectAccessType, orderAccessType].includes('READ')) return 'READ';
  return null;
};

export const getTeamsHighestAccessType = (teamAccesses): AccessType | null => {
  const teamAccessTypes = teamAccesses.map(teamAccess => {
    if (teamAccess.accessType === 'READ') return 'READ';
    if (teamAccess.teamMembership.role === 'VIEWER') return 'READ';
    if (teamAccess.accessType === 'WRITE') return 'WRITE';
    throw new Error('Should not be reachable');
  });

  if (!teamAccessTypes.length) return null;
  if (teamAccessTypes.includes('WRITE')) return 'WRITE';
  return 'READ';
};

export const enrichTeamAccessWithMemberships = async (
  teamAccessesPlain: Access[],
  teamMemberships: TeamMembership[],
) => {
  return teamAccessesPlain.map(teamAccess => {
    return {
      ...teamAccess,
      teamMembership: teamMemberships.find(
        teamMembership => teamMembership.teamId === teamAccess.receivingTeamId,
      ),
    };
  });
};

export const getProjectAccessTypeByUserWithOrders = async (
  projectId: number,
  userId: number,
  teamMemberships: TeamMembership[],
) => {
  const project = await ensureProjectExistsWithOrders(projectId);

  const projectAccess = await getProjectAccessTypeByUser(
    projectId,
    userId,
    teamMemberships,
  );

  /* TODO this screams for queries optimisation / caching */
  const orders = Object.fromEntries(
    await Promise.all(
      project.orders.map(async order => {
        const { accessType } = await getOrderAccessTypeByUser(
          order.id,
          userId,
          teamMemberships,
        );
        return [order.id, accessType];
      }),
    ),
  );

  return { ...projectAccess, orders };
};

export const getProjectAccessTypeByUser = async (
  projectId: number,
  userId: number,
  teamMemberships: TeamMembership[],
) => {
  await ensureProjectExists(projectId);
  const personalAccess = await prisma.access.findFirst({
    where: { projectId, receivingUserId: userId },
  });

  const teamAccesses = await enrichTeamAccessWithMemberships(
    await prisma.access.findMany({
      where: {
        projectId,
        receivingTeamId: { in: teamMemberships.map(team => team.teamId) },
      },
    }),
    teamMemberships,
  );

  const accessType = getPersonalOverTeam(
    personalAccess ? personalAccess.accessType : null,
    getTeamsHighestAccessType(teamAccesses),
  );

  return {
    accessType,
    considerationFactors: { personalAccess, teamAccesses },
  };
};

export const getOrderAccessTypeByUser = async (
  orderId: number,
  userId: number,
  teamMemberships: TeamMembership[],
) => {
  const order = await ensureOrderExists(orderId);
  const projectAccess = await getProjectAccessTypeByUser(
    order.projectId,
    userId,
    teamMemberships,
  );

  const personalAccess = await prisma.access.findFirst({
    where: { orderId, receivingUserId: userId },
  });

  const teamAccesses = await enrichTeamAccessWithMemberships(
    await prisma.access.findMany({
      where: {
        orderId,
        receivingTeamId: { in: teamMemberships.map(team => team.teamId) },
      },
    }),
    teamMemberships,
  );

  const orderAccessType = getPersonalOverTeam(
    personalAccess ? personalAccess.accessType : null,
    getTeamsHighestAccessType(teamAccesses),
  );

  return {
    accessType: getHighestAccessType(projectAccess.accessType, orderAccessType),
    considerationFactors: {
      project: projectAccess.accessType && {
        projectAccessType: projectAccess.accessType,
        considerationFactors: {
          personalAccess: projectAccess.considerationFactors.personalAccess,
          teamAccesses: projectAccess.considerationFactors.teamAccesses,
        },
      },
      order: orderAccessType && {
        orderAccessType,
        considerationFactors: {
          personalAccess,
          teamAccesses,
        },
      },
    },
  };
};

export const ensureUserHasProjectAccess = async (
  userId: number,
  project: Project,
  requiredAccessType: AccessType,
) => {
  const teamMemberships = await prisma.teamMembership.findMany({
    where: { userId, status: 'ACTIVE' },
  });

  const { accessType } = await getProjectAccessTypeByUser(
    project.id,
    userId,
    teamMemberships,
  );

  if (project.userId === userId) return;
  if (requiredAccessType === 'READ' && accessType !== null) return;
  if (requiredAccessType === 'WRITE' && accessType === 'WRITE') return;

  throw new TRPCError({
    code: 'FORBIDDEN',
    message: 'Forbidden',
  });
};
