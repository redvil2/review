import { switchColor } from '@app/shared/ui/theme';
import { CircularProgress, ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

import { LoaderPropTypes } from './loader.types';

export const StyledLoader = styled(CircularProgress)<LoaderPropTypes>`
  .chakra-progress__track {
    stroke: ${({ $colorMode }) =>
      switchColor($colorMode as ColorMode).outlineVariant};
  }
`;
