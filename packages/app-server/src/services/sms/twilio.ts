import callingCodes from 'country-calling-code';
import { isNumber } from 'lodash';
import { load } from 'ts-dotenv';
import twilio from 'twilio';

import { SendSMSCodeParams, SMSResponse } from './send-sms.types';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM } = load({
  TWILIO_ACCOUNT_SID: String,
  TWILIO_AUTH_TOKEN: String,
  TWILIO_FROM: String,
});

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export async function sendSmsViaTwilio(
  input: SendSMSCodeParams,
): Promise<SMSResponse> {
  const { text, recipientNumber } = input;

  // TODO: is there a better way to get this type?
  let response: Awaited<ReturnType<typeof client.messages.create>> | undefined;

  try {
    response = await client.messages.create({
      body: text,
      from: TWILIO_FROM,
      to: recipientNumber,
    });
  } catch (error) {
    console.error(error);

    if (!isTwilioError(error)) throw error;

    if (error.code === 20003) {
      return {
        ResponseCode: 'AMOUNT_NOT_ENOUGH',
        ResponseDescription: 'Twilio account is currently suspended',
      };
    }

    if (error.code === 21211) {
      return {
        ResponseCode: 'MOBILE_NUMBER_ILLEGAL',
        ResponseDescription: error.message,
      };
    }

    throw error;
  }

  if (!response) {
    return {
      ResponseCode: 'ERROR',
      ResponseDescription: 'No response from Twilio',
    };
  }

  return {
    ResponseCode: 'OK',
    ResponseDescription: response.body,
  };
}

export async function detectPhoneNumberCountry(
  recipientNumber: string,
): Promise<string> {
  try {
    const response = await client.lookups.v2
      .phoneNumbers(
        recipientNumber.startsWith('+')
          ? recipientNumber
          : `+${recipientNumber}`,
      )
      .fetch();

    const code = callingCodes.find(
      code => code.isoCode2 === response.countryCode,
    );

    return code?.country || 'Detecting...';
  } catch (e) {
    if (!isTwilioError(e)) throw e;

    if (e.code === 20003) {
      /* ToDo Implement local solution to avoid twilio failures */
      return 'Detecting...';
    }

    throw e;
  }
}

interface TwilioError extends Error {
  code: number;
}

function isTwilioError(err: unknown): err is TwilioError {
  if (typeof err !== 'object' || err === null) return false;
  return 'code' in err && isNumber(err.code);
}
