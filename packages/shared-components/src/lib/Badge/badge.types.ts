import { ColorMode } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import { BadgeVariant } from './badge.variants';

export type BadgePropTypes = PropsWithChildren<{
  // TODO: add icon names as type
  iconName?: string;
  variant?: BadgeVariant;
  noDot?: boolean;
  className?: string;
}>;

export interface StyledBadgePropTypes extends BadgePropTypes {
  $colorMode: ColorMode;
  children: null;
}
