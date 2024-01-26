import { switchColor } from '@app/shared/ui/theme';
import { Badge as CBadge, ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

import { StyledBadgePropTypes } from './badge.types';
import { BadgeVariant } from './badge.variants';

const useBadgeColor = (colorMode: ColorMode): Record<BadgeVariant, string> => {
  return {
    default: switchColor(colorMode).primary,
    surface: switchColor(colorMode).onSurfaceVariant,
    surfaceVariant: switchColor(colorMode).surfaceVariant,
    tertiary: switchColor(colorMode).tertiary,
    aqua: switchColor(colorMode).extended.aqua.color,
    sun: switchColor(colorMode).extended.sun.color,
    grass: switchColor(colorMode).extended.grass.color,
  };
};

export const StyledBadge = styled(CBadge)<StyledBadgePropTypes>`
  .al-badge {
    &-dot {
      height: 6px;
      width: 6px;
      border-radius: 6px;
      margin-right: 0.25rem;
      background-color: ${({ $colorMode, variant = 'default' }) =>
        // TODO: type problem here. Find a way to avoid 'as BadgeVariant'
        //   seems like 'variant' key clashes with some internal types (styled-components or chakra)
        //   and therefore it has some extra possilbe values
        useBadgeColor($colorMode)[variant as BadgeVariant]};
    }

    &-icon {
      font-size: 1rem;
      margin: 0 0.15rem 0 -0.15rem;
    }
  }
`;
