import styled from 'styled-components';

export const StyledShareLabelPage = styled.div`
  background-color: ${({ theme }) => theme.colors.current.surface2};
  .w100 {
    width: 100%;
  }
  .self-end {
    align-self: end;
  }
  .al-headline {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .al-card {
    width: 100%;
  }

  .card-invitee {
    .al-card-header__right-icon {
      order: 1;
      color: ${({ theme }) => theme.colors.current.outlineVariant};
    }

    .al-card-header__back .al-button {
      order: 2;
      margin-left: 1rem;
      span.material-symbols-rounded {
        font-size: 1.6rem;
      }
    }
  }

  .al-current-members-count {
    color: ${({ theme }) => theme.colors.current.primary};
  }

  .suggested-members-title {
    width: 100%;
    color: ${({ theme }) => theme.colors.current.secondary};
    padding-left: 0.5rem;
  }
`;
