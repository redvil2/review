import { User, UserSettings } from '@app/prisma';
import { TRPCError } from '@trpc/server';
import { customAlphabet } from 'nanoid';
import { z } from 'zod';

import { prisma, prismaResetCachedPlan } from '../../services/db';
import { invitationsAccept } from '../../services/db/utils';
import { encodeJwtTokens } from '../../services/jwt';
import {
  ensureHasBalance,
  ensureNoPlusOnNumber,
  ensureNumberIsValid,
  detectPhoneNumberCountry,
  sendSms,
} from '../../services/sms';
import { getPreferredLanguage } from '../../utils/get-preferred-language';
import { publicProcedure, routerFactory } from '../trpc';

const codeFactory = customAlphabet('1234567890');
type smsCodeVerifyOutput = {
  user: User;
  userSettings: UserSettings;
  accessToken: string;
  refreshToken: string;
};

const SmsCodeVerifyInput = z.object({
  recipientNumber: z.string(),
  code: z.number(),
  invitationToken: z.string().optional(),
  languageCode: z.string().optional(),
});

export const smsRouter = routerFactory({
  codeVerify: publicProcedure
    .input(SmsCodeVerifyInput)
    .mutation(async ({ input, ctx }): Promise<smsCodeVerifyOutput> => {
      const { recipientNumber, code, invitationToken } = input;
      const matchingCode = await prisma.smsCode.findFirst({
        where: {
          recipientNumber,
          code,
        },
        orderBy: { id: 'desc' },
      });

      if (!matchingCode) {
        throw new TRPCError({
          message: 'Invalid code',
          code: 'BAD_REQUEST',
        });
      }

      let userSettings;
      let user = await prisma.user.findFirst({
        where: { mobilePhone: recipientNumber },
      });

      if (user) {
        userSettings = await prisma.userSettings.findUnique({
          where: { userId: user.id },
        });
      } else {
        const country = await detectPhoneNumberCountry(recipientNumber);
        user = await prisma.user.create({
          data: { mobilePhone: recipientNumber },
        });
        if (user.id === 1) {
          await prismaResetCachedPlan();
        }
        try {
          userSettings = await prisma.userSettings.create({
            data: {
              userId: user.id,
              country,
              language: getPreferredLanguage({
                languageCode: input.languageCode,
                browserPreferredLanguage: ctx.preferredLanguage,
              }),
            },
          });
        } catch (e) {
          await prisma.user.delete({ where: { id: user.id } });
          throw e;
        }
        await invitationsAccept(user.id, invitationToken, { recipientNumber });
      }

      await prisma.smsCode.deleteMany({
        where: {
          recipientNumber,
        },
      });

      return {
        user,
        userSettings,
        ...encodeJwtTokens(user.id),
      };
    }),

  codeSend: publicProcedure
    .input(z.object({ recipientNumber: z.string() }))
    .mutation(async ({ input }) => {
      const { recipientNumber } = input;

      await ensureNoPlusOnNumber(recipientNumber);
      const code = +codeFactory(6);

      const lastCode = await prisma.smsCode.findFirst({
        where: {
          recipientNumber: recipientNumber,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const passed = lastCode
        ? Math.floor((Date.now() - lastCode.createdAt.getTime()) / 1e3)
        : null;

      if (lastCode && passed !== null && passed < 30) {
        const message = `Please wait ${
          30 - passed
        } seconds before requesting a new code.`;
        throw new TRPCError({
          message,
          code: 'TOO_MANY_REQUESTS',
        });
      }

      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      await prisma.smsCode.deleteMany({
        where: {
          createdAt: {
            lt: fifteenMinutesAgo,
          },
        },
      });

      await prisma.smsCode.create({
        data: {
          code,
          recipientNumber,
        },
      });

      /* ToDo implement balance drain protection for same ip multiple numbers requests */
      const response = await sendSms({
        recipientNumber,
        text: `Your code is: ${code}`,
      });

      await ensureNumberIsValid(response, { recipientNumber, code });
      await ensureHasBalance(response);

      return { message: 'success' };
    }),
});
