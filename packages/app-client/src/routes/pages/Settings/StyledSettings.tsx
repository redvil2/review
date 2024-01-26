import { switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledSettings = styled.div<{ $colorMode: ColorMode }>`
  background: ${({ $colorMode }) => switchColor($colorMode).surface2};
  min-height: 100vh;

  .btn-back {
    margin: 1rem 0;
    align-self: flex-start;
  }

  .al-headline {
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    color: ${({ $colorMode }) => switchColor($colorMode).onPrimaryContainer};

    &.welcome {
      margin-top: 6rem;
    }
  }

  .al-card {
    width: 100%;
  }

  .btn-next {
    margin-top: 2rem;
  }

  .al-domain-names-placeholder {
    color: ${({ theme }) => theme.colors.current.secondary};
  }
`;
