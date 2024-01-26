import { Invitation } from '@app/prisma';
import { TRPCError } from '@trpc/server';
import { load } from 'ts-dotenv';

import { sendEmail } from '../../email';
import { ensureHasBalance, ensureNumberIsValid, sendSms } from '../../sms';
import { prisma } from '../prisma';

import { maybeCreateContact } from './contact';
import { ensureUserExists } from './user';

const { CORE_WEB_URL, AWS_HOSTED_ZONE_DOMAIN } = load({
  CORE_WEB_URL: String,
  AWS_HOSTED_ZONE_DOMAIN: String,
});

export const ensureProjectInvitationIsNotDuplicate = async (
  recipientEmail: string | null,
  recipientNumber: string | null,
  projectId: number | null,
) => {
  if (!recipientEmail && !recipientNumber) {
    throw new Error('Should not be reachable');
  }
  const invitation = await prisma.invitation.findFirst({
    where: {
      type: 'PROJECT',
      projectId,
      OR: [
        ...(recipientEmail ? [{ recipientEmail }] : []),
        ...(recipientNumber ? [{ recipientNumber }] : []),
      ],
    },
  });

  if (invitation) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Invitation exists (id: ${invitation.id})`,
    });
  }
};

export const ensureTeamInvitationIsNotDuplicate = async (
  recipientEmail: string | null,
  recipientNumber: string | null,
  teamId: number | null,
) => {
  if (!recipientEmail && !recipientNumber) {
    throw new Error('Should not be reachable');
  }
  const invitation = await prisma.invitation.findFirst({
    where: {
      type: 'TEAM',
      teamId,
      OR: [
        ...(recipientEmail ? [{ recipientEmail }] : []),
        ...(recipientNumber ? [{ recipientNumber }] : []),
      ],
    },
  });

  if (invitation) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Invitation exists (id: ${invitation.id})`,
    });
  }
};

export const ensureInvitationExists = async (id: number) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id },
    include: { team: true, project: true },
  });

  if (!invitation) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Team invitation not found',
    });
  }

  return invitation;
};

export const ensureInvitationExistsByToken = async (
  token: string,
): Promise<Invitation> => {
  /* ToDo implement protection from invitations scanning/monitoring */
  const invitation = await prisma.invitation.findFirst({
    where: { token, status: 'PENDING' },
    include: { team: true, invitingUser: true },
  });

  if (!invitation) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Team invitation not found',
    });
  }

  return invitation;
};

export const hasRecipientNumber = (
  invitation: Invitation,
): invitation is Invitation & { recipientNumber: string } => {
  return !!invitation.recipientNumber;
};

export const hasRecipientEmail = (
  invitation: Invitation,
): invitation is Invitation & { recipientEmail: string } => {
  return !!invitation.recipientEmail;
};

export const hasToken = (
  invitation: Invitation,
): invitation is Invitation & { token: string } => {
  return !!invitation.token;
};

const invitationAccept = async (invitation: Invitation, userId: number) => {
  if (
    !invitation ||
    (invitation.expiresAt && new Date(invitation.expiresAt) < new Date())
  )
    return;
  if (invitation.teamId) {
    await prisma.teamMembership.create({
      data: {
        teamId: invitation.teamId,
        role: invitation.membershipRole,
        status: 'ACTIVE',
        userId: userId,
      },
    });
  }
  if (invitation.projectId) {
    await prisma.access.create({
      data: {
        accessScope: 'PROJECT',
        accessType: invitation.accessType,
        receiverType: 'USER',
        projectId: invitation.projectId,
        orderId: null,
        givingUserId: invitation.invitingUserId,
        receivingUserId: userId,
      },
    });
  }
  await Promise.all([
    prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        invitedUserId: userId,
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      },
    }),
    maybeCreateContact(userId, invitation.invitingUserId),
  ]);
};
export const invitationsAccept = async (
  userId: number,
  token: string | undefined,
  query?: { recipientEmail: string } | { recipientNumber: string },
) => {
  let invitations: Invitation[] = [];
  if (query) {
    invitations = await prisma.invitation.findMany({
      where: {
        status: 'PENDING',
        ...query,
      },
    });
  }
  if (token) {
    const invitation = await prisma.invitation.findFirst({
      where: { status: 'PENDING', token },
    });
    if (invitation) {
      invitations.push(invitation);
    }
  }
  await Promise.allSettled(
    invitations.map(invitation => invitationAccept(invitation, userId)),
  );
};

export const sendInvitationSms = async (
  invitation: Invitation & { recipientNumber: string },
) => {
  const user = await ensureUserExists(invitation.invitingUserId);
  const url = new URL('signin', CORE_WEB_URL);
  if (hasToken(invitation)) {
    url.searchParams.set('token', invitation.token);
  }
  const response = await sendSms({
    recipientNumber: invitation.recipientNumber,
    text: `${user.firstName} ${user.lastName} shared a workspace with you. Sign In here: ${url.href}`,
  });

  await ensureNumberIsValid(response);
  await ensureHasBalance(response);

  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { sentAt: new Date() },
  });
};

export const sendInvitationEmail = async (
  invitation: Invitation & { recipientEmail: string },
) => {
  const user = await ensureUserExists(invitation.invitingUserId);
  const url = new URL('signin', CORE_WEB_URL);
  if (hasToken(invitation)) {
    url.searchParams.set('token', invitation.token);
  }
  const response = await sendEmail({
    recipients: [invitation.recipientEmail],
    subject: `${AWS_HOSTED_ZONE_DOMAIN} invitation from ${user.firstName} ${user.lastName}`,
    body: `${user.firstName} ${user.lastName} shared a workspace with you. Sign In here: ${url.href}`,
  });

  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { sentAt: new Date() },
  });
};
