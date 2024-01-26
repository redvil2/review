import { Meta } from '@storybook/react';
import React from 'react';

import { LineChart } from './LineChart';
import { LineChartProps } from './lineChart.types';

const meta: Meta<typeof LineChart> = {
  title: 'Components/Analytics/LineChart',
  component: LineChart,
};
export default meta;

function getDummyData() {
  const dummyData: object[] = [];
  const today =
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0,
    ).getTime() + 86400000;
  for (let foo = 0; foo < 100; foo++) {
    dummyData.push({
      timestamp: today - 70000000 * (foo * (foo < 5 ? 0.02 : 1)),
      count: 10000 + ((Math.random() * 30000) >> 0),
    });
  }
  dummyData.sort((a, b) => (a['timestamp'] > b['timestamp'] ? 1 : -1));
  return dummyData;
}

export const Default = {
  args: {
    items: getDummyData(),
    labels: ['M', 'T', 'W', 'Th', 'F', 'S', 'S'],
  },
  render: (args: LineChartProps) => <LineChart {...args} />,
};
