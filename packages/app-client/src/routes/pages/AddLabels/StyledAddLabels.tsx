import { switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledAddLabels = styled.div<{ $colorMode: ColorMode }>`
  background: ${({ $colorMode }) => switchColor($colorMode).surface2};

  .al-page-header {
    .al-button {
      justify-content: flex-start;
      max-width: 80%;
    }
  }

  .al-headline {
    margin-bottom: 2rem;
    margin-top: 3rem;
    color: ${({ $colorMode }) => switchColor($colorMode).onPrimaryContainer};
    text-align: center;
  }

  .al-card {
    margin-bottom: 1rem;
  }

  .al-connect-qr-destination {
    margin-left: 1rem;
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
`;
