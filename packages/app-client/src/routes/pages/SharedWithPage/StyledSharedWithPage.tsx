import styled from 'styled-components';

export const StyledSharedWithPage = styled.div`
  background: ${({ theme }) => theme.colors.current.surface2};
  min-height: 100vh;

  .al-card {
    width: 100%;
  }

  .card-invitee {
    width: 100%;
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
`;
