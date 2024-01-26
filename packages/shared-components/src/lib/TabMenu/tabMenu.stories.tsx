import { Meta, StoryObj } from '@storybook/react';

import { Tab, TabList, TabMenu } from './TabMenu';

const meta: Meta<typeof TabMenu> = {
  component: TabMenu,
  title: 'Components / TabMenu',
};

export default meta;

type Story = StoryObj<typeof TabMenu>;

export const Default = () => (
  <TabMenu>
    <TabList>
      <Tab>One</Tab>
      <Tab>Two</Tab>
      <Tab>Three</Tab>
      <Tab isDisabled>Disabled</Tab>
    </TabList>
  </TabMenu>
);
