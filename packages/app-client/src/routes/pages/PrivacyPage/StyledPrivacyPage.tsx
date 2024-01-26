import { switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/color-mode/dist/color-mode-types';
import styled from 'styled-components';

export const StyledPrivacyPage = styled.div`
  background-color: ${({ $colorMode }: { $colorMode: ColorMode }) =>
    switchColor($colorMode).primaryContainer};
`;
