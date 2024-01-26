import { Card } from '@app/shared/ui/components';
import styled from 'styled-components';

export const DropdownCardWrapper = styled(Card)`
  width: 100%;

  .chakra-card__body {
    padding: 0;
  }

  .__left-icon {
    display: flex;
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    font-size: 2.5rem;
  }
  .__right-icon {
    color: ${({ theme }) => theme.colors.current.primary};
    align-self: center;
    margin-right: 1rem;
  }
  .modular-dropdown-button {
    line-height: 1.5rem;
  }

  .dropdown-container {
    padding: 1rem;

    &.with-label {
      padding-top: 0.5rem;
    }
  }

  .modular-dropdown-menu-wrapper {
    border-radius: 1rem;
    overflow: hidden;

    .al-paragraph.__label {
      padding-left: 1rem;
      margin-top: 0.5rem;
    }
  }
  .modular-dropdown-menu {
    width: 100%;
    padding: 0;
  }
  .modular-dropdown-menu-item {
    width: 100%;
    padding: 0.25rem 1rem;

    button {
      padding-top: 0.2rem;
      padding-bottom: 0.2rem;
      line-height: 1.5rem;
    }
  }
`;
