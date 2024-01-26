import { StyledCheckbox } from './checkbox.style';
import { CheckboxPropTypes } from './checkbox.types';

export const Checkbox = ({ ...rest }: CheckboxPropTypes) => {
  return <StyledCheckbox {...rest} />;
};
