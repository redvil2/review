import { Prisma, User } from '@app/prisma';
import { TRPCError } from '@trpc/server';

import { s3RemoveFile } from '../../s3';
import { prisma } from '../prisma';

import { deleteProjectWithData } from './project';
import { deleteTeamWithData } from './teams';

export const PublicUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  userSettings: {
    select: {
      position: true,
    },
  },
} satisfies Prisma.UserSelect;

export const ensureUserExists = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
  }

  return user;
};

export const deleteUserWithData = async (user: User) => {
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
  });

  await Promise.all(
    projects.map(async project => deleteProjectWithData(project)),
  );

  const logos = await prisma.qrLogo.findMany({
    where: { userId: user.id },
  });

  await Promise.all(
    logos.map(async file => {
      const { s3Bucket, s3Key } = file;
      if (s3Key !== null) {
        await s3RemoveFile({ s3Bucket, s3Key });
      }
      await prisma.qrLogo.delete({ where: { id: file.id } });
    }),
  );

  const teamMemberships = await prisma.teamMembership.findMany({
    where: { userId: user.id, role: 'OWNER' },
    include: { team: true },
  });

  await Promise.all(
    teamMemberships.map(async teamMembership =>
      deleteTeamWithData(teamMembership.team),
    ),
  );

  await prisma.user.delete({ where: { id: user.id } });
};
