import { Meta } from '@storybook/react';
import React from 'react';

import { PieChart } from './PieChart';
import { PieChartProps } from './pieChart.types';
import { PIE_CHART_VARIANTS } from './pieChart.variants';

const meta: Meta<typeof PieChart> = {
  title: 'Components/Analytics/PieChart',
  component: PieChart,
  argTypes: {
    center: { control: 'boolean' },
  },
};
export default meta;

export const Default = {
  args: {
    items: [
      { key: 'scanned', count: 28, color: PIE_CHART_VARIANTS.AZURE },
      { key: 'not scanned', count: 55, color: PIE_CHART_VARIANTS.MELROSE },
      { key: 'un-usable', count: 17, color: PIE_CHART_VARIANTS.CARDINAL },
    ],
    center: false,
  },
  render: (args: PieChartProps) => <PieChart {...args} />,
};
