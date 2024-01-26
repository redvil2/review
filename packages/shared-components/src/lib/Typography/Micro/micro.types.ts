import { FontWeight } from '@app/shared/ui/theme';

export interface MicroPropTypes {
  children: string;
  fontWeight: FontWeight;
  className?: string;
}

export interface StyledMicroPropTypes extends MicroPropTypes {}
