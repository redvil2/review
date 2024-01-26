import { Tooltip as CTooltip } from '@chakra-ui/react';
import { FC } from 'react';

import { TooltipPropTypes } from './tooltip.types';

export const Tooltip: FC<TooltipPropTypes> = ({ label, children, ...rest }) => (
  <CTooltip label={label} {...rest}>
    {children}
  </CTooltip>
);
