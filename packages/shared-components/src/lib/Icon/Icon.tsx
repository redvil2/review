import { useColorMode } from '@chakra-ui/react';
import React, { forwardRef } from 'react';

import { StyledIcon } from './icon.style';
import { IconPropTypes } from './icon.types';

export const Icon = forwardRef<HTMLElement, IconPropTypes>(
  ({ children, className, app = false, ...rest }, ref) => {
    const { colorMode } = useColorMode();
    return (
      <StyledIcon
        ref={ref}
        className={`material-symbols-rounded ${className ? className : ''}`}
        $app={app}
        $colorMode={colorMode}
        {...rest}
      >
        {children}
      </StyledIcon>
    );
  },
);
