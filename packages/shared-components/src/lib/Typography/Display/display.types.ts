import { FontWeight } from '@app/shared/ui/theme';

export interface DisplayPropTypes {
  children: string;
  className?: string;
  size: 1 | 2;
  fontWeight: FontWeight;
  textAlign?: 'left' | 'center' | 'right';
}

export interface StyledDisplayPropTypes extends DisplayPropTypes {}
