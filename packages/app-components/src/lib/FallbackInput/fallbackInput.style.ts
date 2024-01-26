import { Box } from '@chakra-ui/react';
import styled from 'styled-components';

export const FallbackWrapper = styled(Box)`
  color: ${({ theme }) => theme.colors.current.onPrimaryContainer};
  .__fallback-input {
    padding: 1rem;
  }
  .__left-icon {
    font-size: 2.5rem;
  }

  .al-fallback-annotation {
    width: 100%;
  }
`;
