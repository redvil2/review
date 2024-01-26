import { switchColor } from '@app/shared/ui/theme';
import { CardHeader as CCardHeader } from '@chakra-ui/react';
import styled from 'styled-components';

import { StyledCardHeaderPropTypes } from './cardHeader.types';

export const StyledCardHeader = styled(CCardHeader)<StyledCardHeaderPropTypes>`
  &.al-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;

    .al-subline {
      width: 100%;
      color: ${({ $colorMode, $disabled }) =>
        switchColor($colorMode)[$disabled ? 'outline' : 'onPrimaryContainer']};
    }

    .al-paragraph {
      color: ${({ $colorMode }) => switchColor($colorMode).secondary};
    }

    .al-context-menu,
    .chakra-switch {
      margin-left: 0.5rem;
    }
  }

  .al-card-header {
    &__front {
      width: 100%;
      display: flex;
      align-items: center;
    }

    &__left-icon {
      margin-right: 1rem;

      &.al-drag {
        color: ${({ $colorMode }) => switchColor($colorMode).secondary};
        cursor: grab;
      }

      &.al-big {
        font-size: 2.5rem;
        span {
          font-size: 2.5rem;
        }
      }
    }

    &__app-icon,
    &__avatar,
    &__generic-slot {
      margin-right: 1rem;
    }
    &__title {
      width: 100%;
    }
    &__title-box {
      display: flex;
      align-items: center;
    }

    &__title-icon {
      margin-left: 0.25rem;
      font-size: 1rem;
      color: ${({ $colorMode }) => switchColor($colorMode).secondary};
    }

    &__back {
      display: flex;
      align-items: center;
    }

    &__right-icon {
      color: ${({ $colorMode }) => switchColor($colorMode).primary};
      margin-left: 0.5rem;
    }
  }
`;
