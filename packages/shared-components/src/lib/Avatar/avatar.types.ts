import { ColorMode } from '@chakra-ui/react';

import { AvatarVariants } from './avatar.variants';

export interface AvatarPropTypes {
  variant: AvatarVariants;
  children?: string;
  src?: string;
  className?: string;
  borderColor?: string;
  size?: 'xs' | 'sm';
}

export interface StyledAvatarPropTypes extends AvatarPropTypes {
  bg: string;
  $colorMode: ColorMode;
}
