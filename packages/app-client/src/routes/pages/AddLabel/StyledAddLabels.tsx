import { FONT_WEIGHT, switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledAddLabels = styled.div<{ $colorMode: ColorMode }>`
  background: ${({ $colorMode }) => switchColor($colorMode).surface2};

  .al-headline {
    color: ${({ $colorMode }) => switchColor($colorMode).onPrimaryContainer};
    text-align: center;
    margin-top: 3rem;
    margin-bottom: 2rem;
  }

  .al-label-color {
    color: ${({ $colorMode }) => switchColor($colorMode).secondary};
  }

  .al-subline {
    &.add-flow {
      color: ${({ $colorMode }) => switchColor($colorMode).onPrimaryContainer};
      margin-bottom: 0.5rem;
    }
    &.order-no {
      color: ${({ $colorMode }) => switchColor($colorMode).secondary};
      white-space: nowrap;
    }
  }

  .al-preview {
    height: 8rem;
    width: 8rem;

    &.square {
      height: 7.7rem;
      width: 7.7rem;
      margin-left: 0.2rem;
      margin-top: 0.05rem;
    }

    &-image {
      height: 3.2rem;
      width: 3.15rem;
      top: calc(50% - 1.65rem);
      left: calc(50% - 1.5rem);
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        margin: 0.2rem;
        max-height: calc(100% - 0.4rem);
        max-width: calc(100% - 0.4rem);
      }
    }
    }
  }

  .al-card {
    margin-bottom: 1rem;
    width: 100%
  }

  .al-shape {
    height: 2.5rem;
    width: 2.5rem;
    border: 1px solid ${({ $colorMode }) => switchColor($colorMode).outline};

    &__color {
      border-radius: 0.5rem;
    }

    &__round {
      border-radius: 3rem;
    }
  }

  .al-hash {
    color: ${({ $colorMode }) => switchColor($colorMode).secondary};
  }

  .al-image-upload {
    display: none;
  }

  .al-image {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 2.5rem;
    overflow: hidden;
    border: 1px solid ${({ $colorMode }) => switchColor($colorMode).outline};
  }

  .al-sub-headline {
    color: ${({ $colorMode }) => switchColor($colorMode).onPrimaryContainer};
  }

  .al-edit-info {
    .al-paragraph {
      color: ${({ $colorMode }) => switchColor($colorMode).secondary};
      span {
        margin-left: 0.5rem;
        font-weight: ${FONT_WEIGHT.SEMI_BOLD};
        color: ${({ $colorMode }) =>
          switchColor($colorMode).onPrimaryContainer};
      }
    }
  }

  .al-connect__description {
    color: ${({ $colorMode }) => switchColor($colorMode).onPrimaryContainer};
  }

  .al-connect-qr-destination {
    .card-input__left-icon {
      order: -1;
    }

    .card-input__left-menu {
      margin-top: 1.2rem;
    }

    .card-input__generic-slot {
      margin-right: 0;
    }

    .chakra-form__label {
      &:not(.al-fake-label) {
        visibility: hidden;
      }
    }

    .card-input__text-field.al-fake-label {
      position: absolute;
      top: 0.75rem;
      left: 4.5rem;
    }
  }

  .al-preview-container {
    border-top: 1px solid
      ${({ $colorMode }) => switchColor($colorMode).outlineVariant};

    .al-preview-card {
      color: ${({ $colorMode }) => switchColor($colorMode).secondary};
    }

    .icon-all-labels {
      height: 1.15rem;
      width: 1.15rem;
      margin-right: 0.25rem
    }

    .icon-preview-qr {
      margin-right: 0.25rem;
      height: 1.2rem;
      width: 1.2rem;
      font-size: 1.2rem;
    }
  }
`;
