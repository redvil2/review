import { z } from 'zod';

import { prisma } from '../../services/db';
import {
  PublicUserSelect,
  ensureContactExists,
  ensureContactOwner,
} from '../../services/db/utils';
import { protectedProcedure, routerFactory } from '../trpc';

import { UserSchema } from './user-router';

export const ContactSchema = z.object({
  id: z.number(),
  initiatorUserId: z.number(),
  initiatorUser: UserSchema.optional(),
  userId: z.number(),
  user: UserSchema.optional(),
});

export const contactRouter = routerFactory({
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const contact = await ensureContactExists(input.id);
      ensureContactOwner(contact, ctx.auth.userId);
      await prisma.contact.delete({
        where: { id: contact.id },
      });

      return { success: true };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const contacts = await prisma.contact.findMany({
      where: { initiatorUserId: ctx.auth.userId },
      select: {
        id: true,
        initiatorUserId: true,
        userId: true,
        user: {
          select: PublicUserSelect,
        },
      },
    });

    return { contacts };
  }),
});
