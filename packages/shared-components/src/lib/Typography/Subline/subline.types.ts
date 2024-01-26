import { FontWeight } from '@app/shared/ui/theme';
import { ReactNode } from 'react';

export interface SublinePropTypes {
  children: ReactNode;
  className?: string;
  size: 1 | 2;
  fontWeight: FontWeight;
  textAlign?: 'left' | 'center' | 'right';
}

export interface StyledSublinePropTypes extends SublinePropTypes {}
