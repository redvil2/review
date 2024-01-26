import { AccessType, InvitationStatus, TeamMembershipRole } from '@app/prisma';
import { TRPCError } from '@trpc/server';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { prisma } from '../../services/db';
import {
  ensureAccessIsNotDuplicate,
  ensureInvitationExists,
  ensureInvitationExistsByToken,
  ensureIsNotGivingUser,
  ensureMembershipIsNotDuplicate,
  ensureMembershipRole,
  ensureProjectExists,
  ensureProjectInvitationIsNotDuplicate,
  ensureProjectWriteAccess,
  ensureTeamExists,
  ensureTeamInvitationIsNotDuplicate,
  hasRecipientEmail,
  hasRecipientNumber,
  maybeCreateContact,
  sendInvitationEmail,
  sendInvitationSms,
} from '../../services/db/utils';
import { ensureNoPlusOnNumber } from '../../services/sms';
import { protectedProcedure, publicProcedure, routerFactory } from '../trpc';

import { ProjectSchema } from './project-router';
import { TeamSchema } from './team-router';
import { UserSchema } from './user-router';

const BaseInvitationSchema = z.object({
  id: z.number(),
  invitingUserId: z.number(),
  invitedUserId: z.number().nullable().optional(),
  invitingUser: UserSchema.optional(),
  recipientEmail: z.string().email().nullable().optional(),
  recipientNumber: z.string().nullable().optional(),
  token: z.string().nullable(),
  membershipRole: z.nativeEnum(TeamMembershipRole).optional(),
  accessType: z.nativeEnum(AccessType).optional(),
  status: z.nativeEnum(InvitationStatus),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  expiresAt: z.date().nullable().optional(),
  sentAt: z.date().nullable(),
  acceptedAt: z.date().nullable(),
  rejectedAt: z.date().nullable(),
});

const TeamInvitationSchema = BaseInvitationSchema.extend({
  type: z.literal('TEAM'),
  teamId: z.number().nullable().optional(),
  team: TeamSchema.nullable().optional(),
});

const ProjectInvitationSchema = BaseInvitationSchema.extend({
  type: z.literal('PROJECT'),
  projectId: z.number().nullable().optional(),
  project: ProjectSchema.nullable().optional(),
});

const InvitationSchema = z.discriminatedUnion('type', [
  TeamInvitationSchema,
  ProjectInvitationSchema,
]);

const createFields = {
  recipientEmail: true,
  recipientNumber: true,
  expiresAt: true,
} as const;

const refinement = {
  check: data => !!data.recipientEmail !== !!data.recipientNumber,
  message: 'Exactly one of recipientEmail or recipientNumber must be filled',
};

const TeamInvitationCreateInput = TeamInvitationSchema.pick(createFields)
  .extend({
    teamId: z.number(),
    membershipRole: z.enum(['MANAGER', 'EDITOR', 'VIEWER']),
  })
  .refine(refinement.check, { message: refinement.message });

const ProjectInvitationCreateInput = ProjectInvitationSchema.pick(createFields)
  .extend({
    projectId: z.number(),
    accessType: z.nativeEnum(AccessType),
  })
  .refine(refinement.check, { message: refinement.message });

const InvitationOutput = z.object({
  invitation: InvitationSchema,
});

const InvitationsOutput = z.object({
  invitations: z.array(InvitationSchema),
});

export const invitationRouter = routerFactory({
  createForTeam: protectedProcedure
    .input(TeamInvitationCreateInput)
    .output(InvitationOutput)
    .mutation(async ({ input, ctx }) => {
      let status: InvitationStatus = 'PENDING';
      let expiresAt: Date | null = new Date(Date.now() + 30 * 24 * 3600 * 1000);
      await ensureTeamExists(input.teamId);
      await ensureMembershipRole(input.teamId, ctx.auth.userId, [
        'OWNER',
        'MANAGER',
      ]);
      await ensureTeamInvitationIsNotDuplicate(
        input.recipientEmail ?? null,
        input.recipientNumber ?? null,
        input.teamId,
      );
      if (input.recipientNumber) {
        await ensureNoPlusOnNumber(input.recipientNumber);
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: input.recipientEmail },
            { mobilePhone: input.recipientNumber },
          ],
        },
      });

      if (user) {
        await ensureIsNotGivingUser(ctx.auth.userId, user.id);
        await ensureMembershipIsNotDuplicate(input.teamId, user.id);
        await prisma.teamMembership.create({
          data: {
            teamId: input.teamId,
            role: input.membershipRole,
            status: 'ACTIVE',
            userId: user.id,
          },
        });
        status = 'ACCEPTED';
        expiresAt = null;
      }

      const invitation = await prisma.invitation.create({
        data: {
          teamId: input.teamId,
          invitingUserId: ctx.auth.userId,
          recipientEmail: input.recipientEmail,
          recipientNumber: input.recipientNumber,
          token: nanoid(10),
          membershipRole: input.membershipRole,
          type: 'TEAM',
          status,
          expiresAt,
        },
      });

      if (hasRecipientEmail(invitation)) {
        await sendInvitationEmail(invitation);
      }
      if (hasRecipientNumber(invitation)) {
        await sendInvitationSms(invitation);
      }
      return { invitation };
    }),

  createForProject: protectedProcedure
    .input(ProjectInvitationCreateInput)
    .output(InvitationOutput)
    .mutation(async ({ input, ctx }) => {
      let status: InvitationStatus = 'PENDING';
      let expiresAt: Date | null = new Date(Date.now() + 30 * 24 * 3600 * 1000);
      await ensureProjectInvitationIsNotDuplicate(
        input.recipientEmail ?? null,
        input.recipientNumber ?? null,
        input.projectId,
      );
      if (input.recipientNumber) {
        await ensureNoPlusOnNumber(input.recipientNumber);
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: input.recipientEmail },
            { mobilePhone: input.recipientNumber },
          ],
        },
      });

      if (user) {
        await ensureIsNotGivingUser(ctx.auth.userId, user.id);
        await ensureAccessIsNotDuplicate(input.projectId, null, user.id, null);
        await prisma.access.create({
          data: {
            accessScope: 'PROJECT',
            accessType: input.accessType || 'READ', // 'READ' is for ts only, input.projectId ensures we have input.accessType
            receiverType: 'USER',
            projectId: input.projectId,
            orderId: null,
            givingUserId: ctx.auth.userId,
            receivingUserId: user.id,
          },
        });
        await maybeCreateContact(user.id, ctx.auth.userId);
        status = 'ACCEPTED';
        expiresAt = null;
      }

      const invitation = await prisma.invitation.create({
        data: {
          projectId: input.projectId,
          invitingUserId: ctx.auth.userId,
          recipientEmail: input.recipientEmail,
          recipientNumber: input.recipientNumber,
          token: nanoid(10),
          accessType: input.accessType,
          type: 'PROJECT',
          status,
          expiresAt,
        },
      });

      if (hasRecipientEmail(invitation)) {
        await sendInvitationEmail(invitation);
      }
      if (hasRecipientNumber(invitation)) {
        await sendInvitationSms(invitation);
      }
      return { invitation };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const invitation = await ensureInvitationExists(input.id);
      if (invitation.team) {
        await ensureMembershipRole(invitation.team.id, ctx.auth.userId, [
          'OWNER',
          'MANAGER',
        ]);
      }
      if (invitation.project) {
        await ensureProjectWriteAccess(invitation.project, ctx.auth.userId);
      }

      if (invitation.status === 'ACCEPTED') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Accepted invitations are stored for archiving purpose',
        });
      }

      await prisma.invitation.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  reject: publicProcedure
    .input(z.object({ token: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      const invitation = await ensureInvitationExistsByToken(input.token);

      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'REJECTED' },
      });

      return { success: true };
    }),

  resendSms: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      const invitation = await ensureInvitationExists(input.id);
      if (!hasRecipientNumber(invitation)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invitation is missing recipient number',
        });
      }

      await sendInvitationSms(invitation);
      return { success: true };
    }),

  resendEmail: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      const invitation = await ensureInvitationExists(input.id);
      if (!hasRecipientEmail(invitation)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invitation is missing recipient email',
        });
      }

      await sendInvitationEmail(invitation);
      return { success: true };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(InvitationOutput)
    .query(async ({ input, ctx }) => {
      const invitation = await ensureInvitationExists(input.id);
      if (invitation.team) {
        await ensureMembershipRole(invitation.team.id, ctx.auth.userId, [
          'OWNER',
          'MANAGER',
        ]);
      }
      if (invitation.project) {
        await ensureProjectWriteAccess(invitation.project, ctx.auth.userId);
      }

      return { invitation };
    }),

  getByToken: publicProcedure
    .input(z.object({ token: z.string().optional() }))
    .output(InvitationOutput.or(z.null()))
    .query(async ({ input }) => {
      if (!input.token) return null;

      return {
        invitation: await ensureInvitationExistsByToken(input.token),
      };
    }),

  listOwn: protectedProcedure
    .output(InvitationsOutput)
    .query(async ({ ctx }) => {
      return {
        invitations: await prisma.invitation.findMany({
          where: { invitingUserId: ctx.auth.userId },
        }),
      };
    }),

  listByTeamId: protectedProcedure
    .input(z.object({ teamId: z.number() }))
    .output(InvitationsOutput)
    .query(async ({ input, ctx }) => {
      await ensureTeamExists(input.teamId);
      await ensureMembershipRole(input.teamId, ctx.auth.userId, [
        'OWNER',
        'MANAGER',
      ]);

      return {
        invitations: await prisma.invitation.findMany({
          where: { type: 'TEAM', teamId: input.teamId },
        }),
      };
    }),

  listByProjectId: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .output(InvitationsOutput)
    .query(async ({ input, ctx }) => {
      const project = await ensureProjectExists(input.projectId);
      await ensureProjectWriteAccess(project, ctx.auth.userId);

      return {
        invitations: await prisma.invitation.findMany({
          where: { type: 'PROJECT', projectId: input.projectId },
        }),
      };
    }),
});
