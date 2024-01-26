import { Meta } from '@storybook/react';
import React from 'react';

import { BarDiagram } from './BarDiagram';
import { BarDiagramProps } from './barDiagram.types';

const meta: Meta<typeof BarDiagram> = {
  title: 'Components/Analytics/BarDiagram',
  component: BarDiagram,
  argTypes: {
    center: { control: 'boolean' },
  },
};
export default meta;

export const Default = {
  args: {
    items: [
      { key: 'Safari', count: 54 },
      { key: 'Chrome', count: 32 },
      { key: 'Firefox', count: 12 },
      { key: 'others', count: 2 },
    ],
    center: false,
  },
  render: (args: BarDiagramProps) => <BarDiagram {...args} />,
};
