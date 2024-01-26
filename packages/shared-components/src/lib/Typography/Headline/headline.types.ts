import { FontWeight } from '@app/shared/ui/theme';
import { PropsWithChildren } from 'react';

export type HeadlinePropTypes = PropsWithChildren<{
  size: 1 | 2 | 3 | 4;
  fontWeight: FontWeight;
  className?: string;
  textAlign?: 'left' | 'center' | 'right';
}>;

export interface StyledHeadlinePropTypes extends HeadlinePropTypes {}
