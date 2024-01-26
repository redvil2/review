import { FONT_WEIGHT, subline2 } from '@app/shared/ui/theme';
import { HStack } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledResizableTextArea = styled(HStack)`
  textarea {
    word-break: break-all;
    ${() => subline2(FONT_WEIGHT.SEMI_BOLD)};
    color: ${({ theme }) => theme.colors.current.onPrimaryContainer};

    &::placeholder {
      color: ${({ theme }) => theme.colors.current.outlineVariant};
    }
  }
`;
