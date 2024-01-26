import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { load } from 'ts-dotenv';

const { AWS_REGION, GENERATOR_QR_LAMBDA_FUNCTION_NAME } = load({
  AWS_REGION: String,
  GENERATOR_QR_LAMBDA_FUNCTION_NAME: String,
});

const lambdaClient = new LambdaClient({
  region: AWS_REGION,
});

export async function qrEncode(input) {
  const result = await lambdaClient.send(
    new InvokeCommand({
      FunctionName: GENERATOR_QR_LAMBDA_FUNCTION_NAME,
      Payload: JSON.stringify(input),
    }),
  );

  if (!result.Payload) {
    throw new Error('No payload received');
  }

  const parsedResult = JSON.parse(Buffer.from(result.Payload).toString());

  if (!parsedResult.successful) {
    throw new Error(
      `QR generator failed: ${Buffer.from(result.Payload).toString()}`,
    );
  }

  return Buffer.from(parsedResult.data, 'base64');
}
