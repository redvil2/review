import { Container } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { Logo } from './index';

const meta: Meta<typeof Logo> = {
  component: Logo,
  title: 'Components / Logo',
  decorators: [
    Story => (
      <Container mt="40px" display="flex" flexWrap="nowrap" gap="4">
        <Story />
      </Container>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Default = () => <Logo />;
