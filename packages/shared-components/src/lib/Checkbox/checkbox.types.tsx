import { ChangeEvent } from 'react';

export interface CheckboxPropTypes {
  id?: string;
  name?: string;
  isDisabled?: boolean;
  isChecked?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

export interface StyledCheckboxPropTypes extends CheckboxPropTypes {}
