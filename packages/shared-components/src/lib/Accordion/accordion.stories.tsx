import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '../Badge/Badge';
import { Icon } from '../Icon/Icon';

import {
  Accordion,
  AccordionBodyItem,
  AccordionItem,
  AccordionItemHeader,
  AccordionPanel,
} from './Accordion';

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  title: 'Components/Accordion',
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {},
  render: args => (
    <Accordion {...args}>
      <AccordionItem>
        <AccordionItemHeader>Current Members</AccordionItemHeader>
        <AccordionPanel>
          <AccordionBodyItem>Jane Doe</AccordionBodyItem>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithIcon: Story = {
  args: {},
  render: args => (
    <Accordion {...args}>
      <AccordionItem>
        <AccordionItemHeader>Current Members</AccordionItemHeader>
        <AccordionPanel>
          <AccordionBodyItem iconRight={<Icon>edit</Icon>}>
            Jane Doe
          </AccordionBodyItem>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithSubline: Story = {
  args: {},
  render: args => (
    <Accordion {...args}>
      <AccordionItem>
        <AccordionItemHeader>Current Members</AccordionItemHeader>
        <AccordionPanel>
          <AccordionBodyItem
            subline={<Badge noDot>Viewer</Badge>}
            iconRight={<Icon>edit</Icon>}
          >
            Jane Doe
          </AccordionBodyItem>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
};
