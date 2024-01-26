import React, { forwardRef } from 'react';

import { StyledSwitch } from './switch.style';
import { SwitchPropTypes } from './switch.types';

export const Switch: React.FC<SwitchPropTypes> = forwardRef(
  ({ ...rest }, ref) => {
    return <StyledSwitch {...rest} ref={ref} />;
  },
);
