export interface SendSMSCodeParams {
  recipientNumber: string;
  text: string;
}

export interface SMSResponse {
  ResponseCode: string;
  ResponseDescription: string;
}
