import { Container, VStack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof Radio> = {
  component: Radio,
  title: 'Components / Radio',
  decorators: [
    Story => (
      <Container mt="40px" display="flex" flexWrap="nowrap" gap="4">
        <Story />
      </Container>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Default = () => (
  <RadioGroup>
    <VStack spacing="24px">
      <Radio value="1">default</Radio>
      <Radio value="2">isChecked</Radio>
      <Radio value="3" isDisabled>
        isDisabled
      </Radio>
      <Radio value="4" isReadOnly>
        isReadOnly
      </Radio>
      <Radio value="5" isInvalid isReadOnly>
        isInvalid
      </Radio>
    </VStack>
  </RadioGroup>
);

export const WithChecked: Story = {
  args: {
    isChecked: true,
  },
  render: args => <Radio {...args} />,
};

export const WithDisabled: Story = {
  args: {
    isDisabled: true,
  },
  render: args => <Radio {...args} />,
};

export const WithReadOnly: Story = {
  args: {
    isChecked: true,
    isReadOnly: true,
  },
  render: args => <Radio {...args} />,
};
