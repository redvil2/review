import { Accordion as CAccordion } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledAccordion = styled(CAccordion)`
  width: 100%;
  .al-accordion-body-item {
    cursor: pointer;

    &.al-no-pointer {
      cursor: default;
    }

    &-icon {
      color: ${({ theme }) => theme.colors.current.primary};
    }
  }

  .al-accordion-subtitle {
    color: ${({ theme }) => theme.colors.current.onPrimaryContainer};
  }
`;
