import type { Meta, StoryObj } from '@storybook/react';

import { PageWrapper } from './PageWrapper';

const meta: Meta<typeof PageWrapper> = {
  component: PageWrapper,
  title: 'Components/PageWrapper',
};

export default meta;

type Story = StoryObj<typeof PageWrapper>;

export const Default: Story = {
  args: {},
  render: args => (
    <PageWrapper {...args}>
      <div
        style={{
          width: '1000px',
          height: '300px',
          backgroundColor: 'purple',
          color: 'white',
        }}
      >
        Page contents
      </div>
    </PageWrapper>
  ),
};
