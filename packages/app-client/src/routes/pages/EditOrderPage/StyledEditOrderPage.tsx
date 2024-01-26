import { switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledEditOrder = styled.div<{ $colorMode: ColorMode }>`
  background: ${({ $colorMode }) => switchColor($colorMode).surface2};

  .al-headline {
    color: ${({ $colorMode }) => switchColor($colorMode).onPrimaryContainer};
    text-align: center;
    margin-top: 3rem;
    margin-bottom: 2rem;
  }

  .card-input {
    align-items: flex-start;
  }
  .target-input {
    padding: 0.5rem;
    margin-left: 1rem;
  }
  .fallback-url {
    padding: 0.5rem;
    margin-left: 1rem;
  }
  .al-subline {
    &.order-no {
      color: ${({ $colorMode }) => switchColor($colorMode).secondary};
      white-space: nowrap;
    }
  }

  .al-connect-qr-destination {
    .card-input__switch {
      margin-top: 0.3rem;
    }

    .card-input__left-icon {
      order: -1;
    }

    .card-input__left-menu {
      margin-top: 1.2rem;
    }

    .card-input__generic-slot {
      margin-right: 0;
    }
  }
`;
