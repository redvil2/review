export interface RadioPropTypes {
  id?: string;
  isDisabled?: boolean;
  isChecked?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  children?: React.ReactNode;
  value?: string;
  onClick?: (value?: string) => void;
}

export interface StyledRadioPropTypes extends RadioPropTypes {}
