import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '../../Badge/Badge';
import { Icon } from '../../Icon/Icon';
import { Card } from '../Card/Card';

import { CardFooter } from './CardFooter';

const meta: Meta<typeof CardFooter> = {
  component: CardFooter,
  title: 'Components/Card/CardFooter',
};

export default meta;

type Story = StoryObj<typeof CardFooter>;

export const Default: Story = {
  args: {},
  render: args => (
    <Card
      {...args}
      footer={
        <CardFooter
          btnLeft={{ label: 'Primary action', icon: 'add' }}
          btnRight={{
            label: 'Link action',
            variant: 'secondary',
            icon: 'cancel',
          }}
        >
          <Badge iconName={'check_small'} noDot>
            Some stat
          </Badge>
        </CardFooter>
      }
    >
      Card
    </Card>
  ),
};
