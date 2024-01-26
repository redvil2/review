import { ColorMode } from '@chakra-ui/react';
import React, { CSSProperties, MouseEvent } from 'react';

import { AvatarPropTypes } from '../../Avatar/avatar.types';
import { variants } from '../../Button/button.types';
import { ContextMenuItemWithId } from '../../ContextMenu/contextMenu.types';
import { SwitchPropTypes } from '../../Switch/switch.types';

export interface CardHeaderPropTypes {
  children: React.ReactNode;
  showDragIndicator?: boolean;
  leftIcon?: React.ReactNode;
  xlIcon?: boolean;
  appIcon?: string;
  genericSlot?: React.ReactNode;
  titleIcon?: string;
  avatar?: AvatarPropTypes & { name: string };
  toggle?: SwitchPropTypes;
  button?: {
    label?: string;
    onClick: (e: MouseEvent<HTMLElement>) => void;
    variant?: variants;
    iconName?: string;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
  };
  rightIcon?: {
    name: string;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
  };
  contextMenuItems?: ContextMenuItemWithId[];
  onMenuClick?: () => void;
  contextMenuVariant?: 'blue' | 'alignLeft' | 'blueAndLeft';
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  subtitle?: string | React.ReactNode;
  title?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export interface StyledCardHeaderPropTypes extends CardHeaderPropTypes {
  $colorMode: ColorMode;
  $disabled?: boolean;
}
