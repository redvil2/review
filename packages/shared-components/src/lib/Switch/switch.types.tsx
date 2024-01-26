import { ChangeEvent } from 'react';

export interface SwitchPropTypes {
  id?: string;
  name?: string;
  isDisabled?: boolean;
  isChecked?: boolean;
  isReadOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface StyledSwitchPropTypes extends SwitchPropTypes {}
