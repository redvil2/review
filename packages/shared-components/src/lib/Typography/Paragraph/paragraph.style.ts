import { paragraph1, paragraph2 } from '@app/shared/ui/theme';
import styled, { css } from 'styled-components';

import { StyledParagraphPropTypes } from './paragraph.types';

export const StyledParagraph = styled.h1<StyledParagraphPropTypes>`
  &.al-paragraph {
    ${({ size, fontWeight }) => css`
      ${size === 1 ? paragraph1(fontWeight) : paragraph2(fontWeight)}
    `};

    ${({ textAlign }) => css`
      text-align: ${textAlign};
    `};
  }
`;
