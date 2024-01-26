import { switchColor } from '@app/shared/ui/theme';
import { useColorMode } from '@chakra-ui/react';
import React, { FC } from 'react';

import { LoaderPropTypes } from './loader.types';
import { StyledLoader } from './StyledLoader';

export const Loader: FC<LoaderPropTypes> = ({ size, color }) => {
  const { colorMode } = useColorMode();
  return (
    <StyledLoader
      isIndeterminate
      size={size}
      color={color || switchColor(colorMode).primary}
      $colorMode={colorMode}
    />
  );
};
