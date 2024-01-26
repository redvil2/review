import { TRPCError } from '@trpc/server';
import { load } from 'ts-dotenv';

import { prisma } from '../db/prisma';

const { NODE_ENV } = load({
  NODE_ENV: String,
});

export const ensureNoPlusOnNumber = async (recipientNumber: string) => {
  if (recipientNumber.startsWith('+')) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Number should not start with +',
    });
  }
};

export const ensureNumberIsValid = async (
  response,
  removeCode?: {
    recipientNumber: string;
    code: number;
  },
) => {
  if (['MOBILE_NUMBER_ILLEGAL'].includes(response.ResponseCode)) {
    if (removeCode) {
      await prisma.smsCode.deleteMany({
        where: removeCode,
      });
    }

    throw new TRPCError({
      message: response.ResponseDescription,
      code: 'BAD_REQUEST',
    });
  }
};

export const ensureHasBalance = async response => {
  if (['AMOUNT_NOT_ENOUGH'].includes(response.ResponseCode)) {
    if (NODE_ENV?.startsWith('dev')) {
      // skipping exception in development mode to allow ui testing without draining sms balance
      // unlike user, developer can see error in console and check sms code in database
      console.log(response);
    } else {
      throw new TRPCError({
        message: response.ResponseDescription,
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
};
