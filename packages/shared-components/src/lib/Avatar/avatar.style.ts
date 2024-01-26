import { subline1, FONT_WEIGHT, paragraph2 } from '@app/shared/ui/theme';
import { Avatar as CAvatar } from '@chakra-ui/react';
import styled, { css } from 'styled-components';

import { StyledAvatarPropTypes } from './avatar.types';
import { avatarColors } from './avatar.variants';

export const StyledAvatar = styled(CAvatar)<StyledAvatarPropTypes>`
  // COULD NOT OVERRIDE BASESTYLES IN THEME
  &.al-avatar {
    border: ${({ borderColor, theme }) =>
      `3px solid ${borderColor ? borderColor : theme.colors.current.surface2}`};

    svg {
      color: ${({ variant, $colorMode }) =>
        `${avatarColors($colorMode)[variant].color}`};
    }

    div[role='img'] {
      ${({ size }) => css`
        ${!size && subline1(FONT_WEIGHT.MEDIUM)}
      `}
      color:  ${({ variant, $colorMode }) =>
        `${avatarColors($colorMode)[variant].color}`};
    }
  }
`;
