import { Flex } from '@chakra-ui/react';
import styled from 'styled-components';

import { StyledCardFooterPropTypes } from './cardFooter.types';

export const StyledCardFooter = styled(Flex)<StyledCardFooterPropTypes>`
  .al-card-footer {
    &__button-wrapper {
      display: flex;
      align-items: center;
    }

    &__button-primary,
    &__button-link {
      margin-right: 1rem;
    }
  }
`;
