import React from 'react';

import { StyledMicro } from './micro.style';
import { MicroPropTypes } from './micro.types';

export const Micro: React.FC<MicroPropTypes> = ({
  children,
  className,
  ...rest
}) => (
  <StyledMicro className={`al-micro ${className ? className : ''}`} {...rest}>
    {children}
  </StyledMicro>
);
