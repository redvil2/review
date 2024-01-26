import React from 'react';

import { TabMenuVariants } from './tabMenu.variants';

export interface TabProps {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isDisabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
export interface TabMenuPropTypes {
  onChange?: (index: number) => void;
  variant?: TabMenuVariants;
  children: React.ReactNode;
  index?: number;
  defaultIndex?: number;
}

export interface StyledTabMenuPropTypes extends TabMenuPropTypes {
  variant: TabMenuVariants;
}
