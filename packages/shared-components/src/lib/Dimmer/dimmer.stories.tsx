import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { VStack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  Avatar,
  AVATAR_VARIANTS,
  AvatarGroup,
  Headline,
} from '@app/shared/ui/components';

import { Dimmer } from './Dimmer';

const meta: Meta<typeof Dimmer> = {
  component: Dimmer,
  title: 'Components/Dimmer',
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Dimmer>;

export const Default: Story = {
  args: {},
  render: args => (
    <VStack gap={4} alignItems={'flex-start'}>
      <div>
        <Headline size={2} fontWeight={FONT_WEIGHT.MEDIUM}>
          Without dimmer
        </Headline>
        <AvatarGroup {...args} size={'md'}>
          <Avatar variant={AVATAR_VARIANTS.SUN} />
          <Avatar variant={AVATAR_VARIANTS.OCEAN} />
          <Avatar variant={AVATAR_VARIANTS.GRASS} />
          <Avatar variant={AVATAR_VARIANTS.TERTIARY} />
        </AvatarGroup>
      </div>
      <Dimmer isDimming>
        <Headline size={2} fontWeight={FONT_WEIGHT.MEDIUM}>
          With dimmer
        </Headline>
        <AvatarGroup {...args} size={'md'}>
          <Avatar variant={AVATAR_VARIANTS.SUN} />
          <Avatar variant={AVATAR_VARIANTS.OCEAN} />
          <Avatar variant={AVATAR_VARIANTS.GRASS} />
          <Avatar variant={AVATAR_VARIANTS.TERTIARY} />
        </AvatarGroup>
      </Dimmer>
    </VStack>
  ),
};
