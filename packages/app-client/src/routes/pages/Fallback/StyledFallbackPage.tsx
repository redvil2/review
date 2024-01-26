import { switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledFallbackPage = styled.div<{ $colorMode: ColorMode }>`
  background: ${({ $colorMode }) => switchColor($colorMode).surface2};
`;
