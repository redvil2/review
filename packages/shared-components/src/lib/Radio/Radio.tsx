import { StyledRadio } from './radio.style';
import { RadioPropTypes } from './radio.types';

export const Radio = ({ onClick, ...rest }: RadioPropTypes) => {
  return (
    <StyledRadio
      {...rest}
      onChange={() => {
        onClick && onClick(rest?.value);
      }}
    />
  );
};
