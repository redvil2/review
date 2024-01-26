import React from 'react';

import { StyledSubline } from './subline.style';
import { SublinePropTypes } from './subline.types';

export const Subline: React.FC<SublinePropTypes> = ({
  children,
  className,
  textAlign,
  ...rest
}) => (
  <StyledSubline
    className={`al-subline ${className ? className : ''}`}
    textAlign={textAlign}
    {...rest}
  >
    {children}
  </StyledSubline>
);
