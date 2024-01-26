import { ChangeEvent } from 'react';

export interface SwitchPropTypes {
  size?: 'sm' | 'md' | 'lg';
  defaultChecked?: boolean;
  isChecked?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface StyledSwitchPropTypes {}
