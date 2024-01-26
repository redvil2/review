import styled from 'styled-components';

export const StyledConnectDomain = styled.div`
  background-color: ${({ theme }) => theme.colors.current.surface2};

  .al-headline {
    margin-bottom: 0.5rem;
  }

  .al-paragraph {
    width: 100%;

    &.al-list {
      padding-left: 1.25rem;
    }

    &.al-text,
    &.al-list {
      margin-top: 0.75rem;
      margin-bottom: 1rem;
    }
  }

  .al-value-wrapper {
    overflow-wrap: anywhere;
  }

  .al-icon {
    color: ${({ theme }) => theme.colors.current.primary};
  }

  .al-card {
    width: 100%;
  }

  .al-footer-icon {
    color: ${({ theme }) => theme.colors.current.secondary};
  }
`;
