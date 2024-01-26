import { load } from 'ts-dotenv';

import { sendSmsViaAli } from './ali';
import { SendSMSCodeParams, SMSResponse } from './send-sms.types';
import { sendSmsViaTwilio } from './twilio';

const { SMS_PROVIDER } = load({
  SMS_PROVIDER: ['ali', 'twilio'],
});

export async function sendSms(input: SendSMSCodeParams): Promise<SMSResponse> {
  if (SMS_PROVIDER === 'twilio') {
    return sendSmsViaTwilio(input);
  }
  return sendSmsViaAli(input);
}
