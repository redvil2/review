import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import { load } from 'ts-dotenv';

const {
  AWS_REGION,
  GENERATOR_ECS_CLUSTER,
  GENERATOR_ECS_TASK_DEFINITION,
  GENERATOR_ECS_TASK_DEFINITION_CONTAINER_NAME,
  GENERATOR_ECS_TASK_NETWORK_PUBLIC_IP,
  GENERATOR_ECS_TASK_NETWORK_SUBNETS,
  GENERATOR_ECS_TASK_NETWORK_SECURITY_GROUPS,
} = load({
  AWS_REGION: String,
  GENERATOR_ECS_CLUSTER: String,
  GENERATOR_ECS_TASK_DEFINITION: String,
  GENERATOR_ECS_TASK_DEFINITION_CONTAINER_NAME: String,
  GENERATOR_ECS_TASK_NETWORK_PUBLIC_IP: [
    'ENABLED' as const,
    'DISABLED' as const,
  ],
  GENERATOR_ECS_TASK_NETWORK_SUBNETS: String,
  GENERATOR_ECS_TASK_NETWORK_SECURITY_GROUPS: {
    type: String,
    optional: true,
  },
});

const ecsClient = new ECSClient({
  region: AWS_REGION,
});

export async function createGeneratorTask(input) {
  await ecsClient.send(
    new RunTaskCommand({
      cluster: GENERATOR_ECS_CLUSTER,
      launchType: 'FARGATE',
      taskDefinition: GENERATOR_ECS_TASK_DEFINITION,
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: GENERATOR_ECS_TASK_NETWORK_PUBLIC_IP,
          subnets: GENERATOR_ECS_TASK_NETWORK_SUBNETS.split(',').map(x =>
            x.trim(),
          ),
          securityGroups: GENERATOR_ECS_TASK_NETWORK_SECURITY_GROUPS?.split(
            ',',
          ).map(x => x.trim()),
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: GENERATOR_ECS_TASK_DEFINITION_CONTAINER_NAME,
            environment: [
              {
                name: 'GENERATOR_REQUEST',
                value: JSON.stringify(input),
              },
            ],
          },
        ],
      },
    }),
  );
}
