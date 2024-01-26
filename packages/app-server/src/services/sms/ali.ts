import RPCClient from '@alicloud/pop-core';
import { load } from 'ts-dotenv';

import { SendSMSCodeParams, SMSResponse } from './send-sms.types';

const {
  ALI_SECRET,
  ALI_SMS_REGION,
  ALI_KEY,
  ALI_SMS_SIGNATURE,
  ALI_SMS_TEMPLATE_CODE,
} = load({
  ALI_KEY: String,
  ALI_SECRET: String,
  ALI_SMS_REGION: String,
  ALI_SMS_SIGNATURE: String,
  ALI_SMS_TEMPLATE_CODE: String,
});

// TODO: are there better clients with stricter types?
const client = new RPCClient({
  accessKeyId: ALI_KEY,
  accessKeySecret: ALI_SECRET,
  endpoint: `https://dysmsapi.${ALI_SMS_REGION}.aliyuncs.com`,
  apiVersion: '2018-05-01',
});

const chinaClient = new RPCClient({
  accessKeyId: ALI_KEY,
  accessKeySecret: ALI_SECRET,
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2018-05-01',
});

// China (Qingdao)	cn-qingdao	dysmsapi.aliyuncs.com
// China (Beijing)	cn-beijing	dysmsapi.aliyuncs.com
// China (Zhangjiakou)	cn-zhangjiakou	dysmsapi.aliyuncs.com
// China (Hohhot)	cn-huhehaote	dysmsapi.aliyuncs.com
// China (Ulanqab)	cn-wulanchabu	dysmsapi.aliyuncs.com
// China (Hangzhou)	cn-hangzhou	dysmsapi.aliyuncs.com
// China (Shanghai)	cn-shanghai	dysmsapi.aliyuncs.com
// China (Shenzhen)	cn-shenzhen	dysmsapi.aliyuncs.com
// China (Chengdu)	cn-chengdu	dysmsapi.aliyuncs.com
// China (Hong Kong)	cn-hongkong	dysmsapi.aliyuncs.com	dysmsapi-xman-vpc.cn-hongkong.aliyuncs.com
// Japan (Tokyo)	ap-northeast-1	dysmsapi.ap-southeast-1.aliyuncs.com
// Singapore (Singapore)	ap-southeast-1	dysmsapi.ap-southeast-1.aliyuncs.com
// Australia (Sydney)	ap-southeast-2	dysmsapi.ap-southeast-1.aliyuncs.com
// Malaysia (Kuala Lumpur)	ap-southeast-3	dysmsapi.ap-southeast-1.aliyuncs.com
// Indonesia (Jakarta)	ap-southeast-5	dysmsapi.ap-southeast-1.aliyuncs.com	dysmsapi-xman-vpc.ap-southeast-5.aliyuncs.com
// Europe & Americas
//
// Region name	Region ID	Public network access address	VPC access address
// US (Virginia)	us-east-1	dysmsapi.ap-southeast-1.aliyuncs.com
// US (Silicon Valley)	us-west-1	dysmsapi.ap-southeast-1.aliyuncs.com
// UK (London)	eu-west-1	dysmsapi.ap-southeast-1.aliyuncs.com
// Germany (Frankfurt)	eu-central-1	dysmsapi.ap-southeast-1.aliyuncs.com
// Middle East & India
//
// Region name	Region ID	Public network access address	VPC access address
// India (Mumbai)	ap-south-1	dysmsapi.ap-southeast-1.aliyuncs.com
// UAE (Dubai)	me-east-1	dysmsapi.ap-southeast-1.aliyuncs.com
// Industry Cloud
//
// Region name	Region ID	Public network access address	VPC access address
// China East 1 Finance	cn-hangzhou-finance	dysmsapi.aliyuncs.com
// China East 2 Finance	cn-shanghai-finance-1	dysmsapi.aliyuncs.com
// China South 1 Finance	cn-shenzhen-finance-1	dysmsapi.aliyuncs.com
// China North 2 Finance	cn-beijing-finance-1	dysmsapi.aliyuncs.com

export async function sendSmsViaAli(
  input: SendSMSCodeParams,
): Promise<SMSResponse> {
  const { text, recipientNumber } = input;

  const params = {
    RegionId: ALI_SMS_REGION,
    To: recipientNumber,
    Message: text,
  };

  return recipientNumber.startsWith('86')
    ? chinaClient.request(
        'SendMessageWithTemplate',
        {
          ...params,
          From: ALI_SMS_SIGNATURE,
          TemplateCode: ALI_SMS_TEMPLATE_CODE,
        },
        { method: 'POST' },
      )
    : client.request('SendMessageToGlobe', params, { method: 'POST' });
  // ToDo maybe get country from sms send response
  // {
  //   "ResponseCode": "OK",
  //   "NumberDetail": {
  //   "Carrier": "CMI",
  //     "Region": "HongKong",
  //     "Country": "Hongkong, China"
  // },
  //   "RequestId": "F655A8D5-B967-440B-8683-DAD6FF8DE990",
  //   "Segments": "1",
  //   "ResponseDescription": "The SMS Send Request was accepted",
  //   "From": "Alicloud321",
  //   "To": "1380000****",
  //   "MessageId": "1008030300****"
  // }
}
