import React from 'react';

import { StyledHeadline } from './headline.style';
import { HeadlinePropTypes } from './headline.types';

export const Headline: React.FC<HeadlinePropTypes> = ({
  children,
  className,
  textAlign,
  ...rest
}) => (
  <StyledHeadline
    className={`al-headline ${className ? className : ''}`}
    textAlign={textAlign}
    {...rest}
  >
    {children}
  </StyledHeadline>
);
