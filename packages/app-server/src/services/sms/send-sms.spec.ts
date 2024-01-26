// TODO: We should mock the ali/twilio in tests.
//  Until then, we skip this test.
//  Real SMS be tested in e2e tests.
//  Alternatively, we can agree to actually test real ali/twilio in tests
//  but that must be approved by the management
//  `coz it's going to drain our budget - tests will run frequently.

it('is ok for now', () => {
  expect(true).toBe(true);
});

/*
import { sendSms } from './send-sms';

it.skip('should return the successful response from the alibaba cloud', async () => {
  const res = sendSms({ recipientNumber: '79654264742', text: 'some text' });

  await expect(res).resolves.toEqual({
    //   TODO: define the expected response
  });
});
*/
