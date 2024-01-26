import { User, UserSettings } from '@app/prisma';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import axios from 'axios';
import { load } from 'ts-dotenv';
import { z } from 'zod';

import { prisma, prismaResetCachedPlan } from '../../services/db';
import { invitationsAccept } from '../../services/db/utils';
import { encodeJwtTokens, refreshJwtTokens } from '../../services/jwt';
import { getPreferredLanguage } from '../../utils/get-preferred-language';
import { trcpEventEmitter } from '../context';
import { publicProcedure, routerFactory } from '../trpc';

type OnLoginParams = {
  user: User;
  userSettings: UserSettings;
  accessToken: string;
  refreshToken: string;
};

const VerifyMicrosoftTokenInput = z.object({
  accessToken: z.string(),
  invitationToken: z.string().optional(),
  languageCode: z.string().optional(),
});

const WeChatCallbackInput = z.object({
  invitationToken: z.string().optional(),
  token: z.string(),
  languageCode: z.string().optional(),
});

const { WECHAT_SSO_APP_ID, WECHAT_SSO_APP_SECRET } = load({
  WECHAT_SSO_APP_ID: String,
  WECHAT_SSO_APP_SECRET: String,
});
export const tokenRouter = routerFactory({
  refresh: publicProcedure
    .input(z.object({ refreshToken: z.string() }))
    .query(async ({ input }) => {
      const { refreshToken } = input;

      try {
        const { accessToken: access, refreshToken: refresh } =
          refreshJwtTokens(refreshToken);

        return { access, refresh };
      } catch (error) {
        throw new TRPCError({
          message:
            error instanceof Object && 'message' in error
              ? (error.message as string)
              : '',
          code: 'UNAUTHORIZED',
        });
      }
    }),

  onWechatCalledBack: publicProcedure
    .input(WeChatCallbackInput)
    .subscription(({ input, ctx }) => {
      const { invitationToken, languageCode } = input;
      return observable<OnLoginParams>(emit => {
        // return observable(emit => {
        const onWechatCalledBack = async (data: {
          code: string;
          state: string;
        }) => {
          if (data.state === input.token) {
            const { data: TokenData } = await axios.get(
              'https://api.weixin.qq.com/sns/oauth2/access_token?' +
                new URLSearchParams({
                  appid: WECHAT_SSO_APP_ID,
                  secret: WECHAT_SSO_APP_SECRET,
                  code: data.code,
                  grant_type: 'authorization_code',
                }),
            );
            const { access_token, openid } = TokenData;
            const { data: userinfo } = await axios.get(
              'https://api.weixin.qq.com/sns/userinfo?' +
                new URLSearchParams({ access_token, openid }),
            );

            /*
             userinfo: {
               openid: 'ofMW-6WVTexgKV_e4g82sBRBIzyM',
               nickname: 'Dmitry Matora',
               sex: 0,
               language: '',
               city: '',
               province: '',
               country: '',
               headimgurl: '',
               privilege: []
             },
            */
            const { openid: wechatId, country, language } = userinfo;
            console.log({ TokenData, userinfo });

            let user, userSettings;
            user = await prisma.user.findUnique({ where: { wechatId } });
            if (user) {
              userSettings = await prisma.userSettings.findUnique({
                where: { userId: user.id },
              });
            } else {
              user = await prisma.user.create({
                data: { wechatId },
              });
              if (user.id === 1) {
                await prismaResetCachedPlan();
              }
              try {
                userSettings = await prisma.userSettings.create({
                  data: {
                    userId: user.id,
                    country: country || 'China',
                    language: getPreferredLanguage({
                      languageCode,
                      browserPreferredLanguage: ctx.preferredLanguage,
                      microsoftPreferredLanguage: language,
                    }),
                  },
                });
              } catch (e) {
                await prisma.user.delete({ where: { id: user.id } });
                throw e;
              }
              await invitationsAccept(user.id, invitationToken);
            }

            emit.next({
              user,
              userSettings,
              ...encodeJwtTokens(user.id),
            });
          }
        };
        trcpEventEmitter.on('wechat_callback', onWechatCalledBack);
        return () => {
          trcpEventEmitter.off('wechat_callback', onWechatCalledBack);
        };
      });
    }),

  verifyMicrosoft: publicProcedure
    .input(VerifyMicrosoftTokenInput)
    .mutation(async ({ input, ctx }) => {
      const { accessToken, invitationToken } = input;

      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: 'Bearer ' + accessToken },
      });
      const meJson = await response.json();
      const {
        mobilePhone,
        mail: email,
        preferredLanguage,
        givenName: firstName,
        surname: lastName,
      } = meJson;

      if (!email && !mobilePhone) {
        throw new TRPCError({
          message: 'Azure app is not configured properly',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }

      let user, userSettings;
      if (mobilePhone) {
        user = await prisma.user.findFirst({
          where: { OR: [{ email }, { mobilePhone }] },
        });
      } else {
        user = await prisma.user.findUnique({ where: { email } });
      }
      if (user) {
        userSettings = await prisma.userSettings.findUnique({
          where: { userId: user.id },
        });
      } else {
        user = await prisma.user.create({
          data: { email, mobilePhone, firstName, lastName },
        });
        if (user.id === 1) {
          await prismaResetCachedPlan();
        }
        try {
          userSettings = await prisma.userSettings.create({
            data: {
              userId: user.id,
              country: 'Germany',
              language: getPreferredLanguage({
                languageCode: input.languageCode,
                browserPreferredLanguage: ctx.preferredLanguage,
                microsoftPreferredLanguage: preferredLanguage,
              }),
            },
          });
        } catch (e) {
          await prisma.user.delete({ where: { id: user.id } });
          throw e;
        }
        await invitationsAccept(user.id, invitationToken, {
          recipientEmail: email,
        });
      }

      return {
        user,
        userSettings,
        ...encodeJwtTokens(user.id),
      };
    }),
});
