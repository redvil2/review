import { PrintingMethod, ProjectType, QrType, Shape } from '@app/prisma';
import { z } from 'zod';

import { prisma } from '../../services/db';
import {
  PublicUserSelect,
  deleteProjectWithData,
  ensureProjectExists,
  ensureProjectExistsWithRelations,
  ensureProjectOwner,
  ensureUserExists,
  ensureUserHasProjectAccess,
  getUserTeamIds,
  sortByLastOrder,
  toProjectWithLastOrderInfo,
  uploadProjectLogo,
} from '../../services/db/utils';
import { ensureUsableDomainName } from '../../services/db/utils/domainName';
import { protectedProcedure, routerFactory } from '../trpc';

import { DomainNameSchema } from './domain-name-router';
import { OrderSchema } from './order-router';

export const ProjectSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string().min(1),
  article: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
  printProvider: z
    .string()
    .min(1)
    .optional()
    .nullable()
    .describe('Print Provider Company Name'),
  labelCustomer: z
    .string()
    .nullable()
    .optional()
    .describe('Label Customer Company Name'),
  type: z.nativeEnum(ProjectType),
  qrType: z.nativeEnum(QrType),
  printingMethod: z.nativeEnum(PrintingMethod),
  color: z.string().min(1),
  bgColor: z.string().min(1).nullable(),
  shape: z.nativeEnum(Shape),
  qrDomainNameId: z.number().nullable().optional(),
});

export const ProjectWithDomainNameSchema = ProjectSchema.extend({
  qrDomainName: DomainNameSchema.nullable(),
});

export const ProjectWithDomainNameAndOrders = ProjectSchema.extend({
  orders: OrderSchema.array(),
  lastOrderUrl: z.string().nullable(),
  qrDomainName: DomainNameSchema.nullable(),
});

const ProjectCreateInput = ProjectSchema.omit({
  id: true,
  userId: true,
}).extend({
  logoDataURI: z.string().optional().nullable(),
});

const ProjectUpdateInput = ProjectSchema.partial()
  .omit({
    userId: true,
  })
  .extend({
    id: z.number(),
  });

const ProjectOutput = z.object({ project: ProjectSchema });

const ProjectOutputWithDomainName = z.object({
  project: ProjectWithDomainNameSchema,
});

const ProjectsOutput = z.object({
  projects: z.array(ProjectWithDomainNameAndOrders),
});

export const projectRouter = routerFactory({
  create: protectedProcedure
    .input(ProjectCreateInput)
    .output(ProjectOutputWithDomainName)
    .mutation(async ({ input, ctx }) => {
      if (input.qrDomainNameId) {
        await ensureUsableDomainName(input.qrDomainNameId, ctx.auth.userId);
      }

      const userId = ctx.auth.userId;

      const project = await prisma.project.create({
        data: {
          title: input.title,
          article: input.article,
          label: input.label,
          labelCustomer: input.labelCustomer,
          printProvider: input.printProvider,
          type: input.type,
          qrType: input.qrType,
          printingMethod: input.printingMethod,
          color: input.color,
          bgColor: input.bgColor,
          shape: input.shape,
          qrDomainNameId: input.qrDomainNameId,
          userId,
          accesses: {
            create: {
              furtherSharing: true,
              accessScope: 'PROJECT',
              accessType: 'WRITE',
              receiverType: 'USER',
              givingUserId: userId,
              receivingUserId: userId,
              isOwner: true,
            },
          },
        },
        include: {
          qrDomainName: true,
          orders: true,
        },
      });

      if (input.logoDataURI) {
        await uploadProjectLogo(ctx.auth.userId, project.id, input.logoDataURI);
      }

      return { project: toProjectWithLastOrderInfo(project) };
    }),

  update: protectedProcedure
    .input(ProjectUpdateInput)
    .output(ProjectOutputWithDomainName)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateInput } = input;
      const project = await ensureProjectExists(id);
      await ensureUserHasProjectAccess(ctx.auth.userId, project, 'WRITE');

      const updatedProject = await prisma.project.update({
        where: { id },
        data: updateInput,
        include: {
          qrDomainName: true,
          orders: true,
        },
      });

      return { project: toProjectWithLastOrderInfo(updatedProject) };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const project = await ensureProjectExists(input.id);
      await ensureProjectOwner(project, ctx.auth.userId);
      await deleteProjectWithData(project);

      return { success: true };
    }),

  transferOwnership: protectedProcedure
    .input(z.object({ projectId: z.number(), targetUserId: z.number() }))
    .output(ProjectOutput)
    .mutation(async ({ input, ctx }) => {
      const project = await ensureProjectExists(input.projectId);
      const ownerAccess = await ensureProjectOwner(project, ctx.auth.userId);
      await ensureUserExists(input.targetUserId);

      await prisma.access.update({
        where: { id: ownerAccess.id },
        data: { receivingUserId: input.targetUserId },
      });

      const updatedProject = await prisma.project.update({
        where: { id: project.id },
        data: { userId: input.targetUserId },
        include: { orders: true },
      });

      return { project: toProjectWithLastOrderInfo(updatedProject) };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(ProjectOutputWithDomainName)
    .query(async ({ input, ctx }) => {
      const project = await ensureProjectExistsWithRelations(input.id, {
        orders: true,
        qrDomainName: true,
      });

      await ensureUserHasProjectAccess(ctx.auth.userId, project, 'READ');

      return { project };
    }),

  listOwn: protectedProcedure.output(ProjectsOutput).query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          {
            accesses: {
              some: {
                receivingUserId: ctx.auth.userId,
                isOwner: true,
              },
            },
          },
        ],
      },
      include: {
        orders: true,
        qrDomainName: true,
      },
    });

    return {
      projects: sortByLastOrder(projects).map(toProjectWithLastOrderInfo),
    };
  }),

  listAccessible: protectedProcedure
    .output(ProjectsOutput)
    .query(async ({ ctx }) => {
      const userTeamIds = await getUserTeamIds(ctx.auth.userId);
      const projects = await prisma.project.findMany({
        where: {
          OR: [
            {
              accesses: {
                some: {
                  receivingUserId: ctx.auth.userId,
                  isOwner: false,
                },
              },
            },
            { accesses: { some: { receivingTeamId: { in: userTeamIds } } } },
          ],
        },
        include: {
          orders: true,
          qrDomainName: true,
        },
      });

      return {
        projects: sortByLastOrder(projects).map(toProjectWithLastOrderInfo),
      };
    }),

  getMembers: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const project = await ensureProjectExists(input.id);
      await ensureUserHasProjectAccess(ctx.auth.userId, project, 'READ');

      return prisma.access.findMany({
        orderBy: { createdAt: 'asc' },
        where: { projectId: input.id },
        include: {
          receivingUser: {
            select: PublicUserSelect,
          },
          receivingTeam: {
            select: {
              id: true,
              name: true,
              type: true,
              memberships: {
                select: {
                  id: true,
                  role: true,
                  status: true,
                  user: {
                    select: PublicUserSelect,
                  },
                },
              },
            },
          },
        },
      });
    }),
});
