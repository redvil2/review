import { Contact } from '@app/prisma';
import { TRPCError } from '@trpc/server';

import { prisma } from '../prisma';

export const ensureContactExists = async (id: number) => {
  const contact = await prisma.contact.findUnique({ where: { id } });

  if (!contact) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Contact not found' });
  }

  return contact;
};

export const ensureContactOwner = (contact: Contact, userId: number) => {
  if (contact.userId !== userId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Forbidden',
    });
  }
};

export const maybeCreateContact = async (
  userId: number,
  initiatorUserId: number,
) => {
  if (
    !(await prisma.contact.findUnique({
      where: { userId_initiatorUserId: { userId, initiatorUserId } },
    }))
  ) {
    await prisma.contact.create({ data: { initiatorUserId, userId } });
  }
};
