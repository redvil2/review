import { Box } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledFromErrorMessage = styled(Box)`
  color: ${({ theme }) => theme.colors.current.error};
  margin-top: -0.5rem;
  font-size: 0.87rem;
`;
