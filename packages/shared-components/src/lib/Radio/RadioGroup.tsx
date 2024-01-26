import { StyledRadioGroup } from './radiogroup.style';
import { RadioGroupPropTypes } from './radiogroup.types';

export const RadioGroup = ({ ...rest }: RadioGroupPropTypes) => {
  return <StyledRadioGroup {...rest} />;
};
