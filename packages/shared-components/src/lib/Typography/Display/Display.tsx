import React from 'react';

import { StyledDisplay } from './display.style';
import { DisplayPropTypes } from './display.types';

export const Display: React.FC<DisplayPropTypes> = ({
  children,
  className,
  size = 1,
  textAlign,
  ...rest
}) => (
  <StyledDisplay
    className={`al-display ${className ? className : ''}`}
    size={size}
    textAlign={textAlign}
    {...rest}
  >
    {children}
  </StyledDisplay>
);
