import {
  FONT_WEIGHT,
  paragraph2,
  subline2,
  switchColor,
} from '@app/shared/ui/theme';
import styled from 'styled-components';

import { StyledCardInputPropTypes } from './cardInput.types';

export const StyledCardInput = styled.div<StyledCardInputPropTypes>`
  display: flex;
  align-items: center;
  padding: 1rem;

  .card-input {
    &__left-menu,
    &__right-menu {
      flex: 1 0 auto;
    }

    &__right-menu {
      margin-left: 1rem;
    }

    &__generic-slot {
      margin-right: 1rem;
    }

    &__left-icon {
      color: ${({ $colorMode, $filledInput }) =>
        $filledInput
          ? switchColor($colorMode).onPrimaryContainer
          : switchColor($colorMode).outlineVariant};
      margin-right: 1rem;
      font-size: 2.5rem;
    }

    &__text-field {
      flex: 0 1 auto;

      label {
        ${() => paragraph2(FONT_WEIGHT.REGULAR)};
        margin-bottom: 0;
        color: ${({ $colorMode }) => switchColor($colorMode).secondary};
      }

      input {
        ${() => subline2(FONT_WEIGHT.REGULAR)};
        text-overflow: ellipsis;
        color: ${({ $colorMode, $readonly }) =>
          $readonly
            ? switchColor($colorMode).secondary
            : switchColor($colorMode).onPrimaryContainer};
        font-weight: ${FONT_WEIGHT.SEMI_BOLD};
        &::placeholder {
          color: ${({ $colorMode }) => switchColor($colorMode).outlineVariant};
        }
        &:disabled {
          &::placeholder {
            color: ${({ $colorMode }) => switchColor($colorMode).outline};
          }
        }
      }

      .chakra-form__helper-text {
        margin-top: 0;
        ${() => paragraph2(FONT_WEIGHT.REGULAR)};
        color: ${({ $colorMode }) => switchColor($colorMode).secondary};
      }

      .__error-message {
        margin-top: -0.3rem;
        ${() => paragraph2(FONT_WEIGHT.REGULAR)};
        color: ${({ $colorMode }) => switchColor($colorMode).error};
      }
    }
    &__indicator {
      color: ${({ $colorMode }) => switchColor($colorMode).primary};
      visibility: ${({ $filledInput }) =>
        $filledInput ? 'visible' : 'hidden'};
    }
  }
`;
