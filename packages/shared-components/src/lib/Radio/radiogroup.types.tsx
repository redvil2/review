import { ChangeEvent } from 'react';

export interface RadioGroupPropTypes {
  id?: string;
  name?: string;
  value?: string;
  children?: React.ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface StyledRadioGroupPropTypes extends RadioGroupPropTypes {}
