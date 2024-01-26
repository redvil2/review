import { CompanyType, Language } from '@app/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { prisma } from '../../services/db/prisma';
import { deleteUserWithData, ensureUserExists } from '../../services/db/utils';
import { protectedProcedure, publicProcedure, routerFactory } from '../trpc';

export const UserSchema = z.object({
  id: z.number(),
  mobilePhone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  firstName: z.string().min(1).optional().nullable(),
  lastName: z.string().min(1).optional().nullable(),
  companyName: z.string().optional().nullable(),
  userSettings: z
    .object({
      position: z.string().nullable(),
    })
    .nullable(),
});

const UserSettingsInput = z.object({
  onboard: z.boolean().optional(),
  onboardExtended: z.boolean().optional(),
  language: z.nativeEnum(Language).optional(), // TODO add support for trpc panel
  country: z.string().min(1).optional(),
  companyType: z.nativeEnum(CompanyType).optional(),
  position: z.string().min(1).optional(),
});

export const UserInput = UserSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
  companyName: true,
});

export const userRouter = routerFactory({
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.userId) {
      return {};
    }

    const user = await ensureUserExists(ctx.auth.userId);

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: ctx.auth.userId },
    });

    if (!userSettings) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User settings not found',
      });
    }

    return { user, userSettings };
  }),

  update: protectedProcedure
    .input(UserInput)
    .mutation(async ({ input, ctx }) => {
      await ensureUserExists(ctx.auth.userId);

      const user = await prisma.user.update({
        where: { id: ctx.auth.userId },
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          companyName: input.companyName,
        },
      });

      return { user };
    }),

  delete: protectedProcedure
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx }) => {
      const user = await ensureUserExists(ctx.auth.userId);
      await deleteUserWithData(user);

      return { success: true };
    }),

  settingsUpdate: protectedProcedure
    .input(UserSettingsInput)
    .mutation(async ({ input, ctx }) => {
      const userSettings = await prisma.userSettings.update({
        where: { userId: ctx.auth.userId },
        data: {
          onboard: input.onboard,
          onboardExtended: input.onboardExtended,
          language: input.language,
          country: input.country,
          companyType: input.companyType,
          position: input.position,
        },
      });

      if (!userSettings) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User settings not found',
        });
      }

      return { userSettings };
    }),
});
