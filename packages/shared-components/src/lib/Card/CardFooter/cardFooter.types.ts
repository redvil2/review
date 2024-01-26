import React from 'react';

import { variants } from '../../Button/button.types';

export interface CardFooterPropTypes {
  children?: React.ReactNode;
  btnLeft?: {
    label: string;
    icon?: string;
    variant?: variants;
    onClick?: () => void;
  };
  btnRight?: {
    label: string;
    icon?: string;
    variant?: variants;
    onClick?: () => void;
  };
  actions?: React.ReactNode;
}

export interface StyledCardFooterPropTypes extends CardFooterPropTypes {}
