import { FontWeight } from '@app/shared/ui/theme';
import { PropsWithChildren } from 'react';

export type ParagraphPropTypes = PropsWithChildren<{
  size: 1 | 2;
  fontWeight: FontWeight;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
}>;

export interface StyledParagraphPropTypes extends ParagraphPropTypes {}
