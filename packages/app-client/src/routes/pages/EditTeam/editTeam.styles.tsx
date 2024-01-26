import styled from 'styled-components';

export const StyledEditTeam = styled.div`
  background-color: ${({ theme }) => theme.colors.current.surface2};

  .al-card {
    width: 100%;
  }
  .self-end {
    align-self: end;
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

  .suggested-members-title {
    width: 100%;
    color: ${({ theme }) => theme.colors.current.secondary};
    padding-left: 0.5rem;
  }

  .al-accordion {
    width: 100%;

    .al-current-members-count {
      color: ${({ theme }) => theme.colors.current.primary};
    }
  }

  .al-accordion-header_animate-icon .al-accordion-icon {
    transition: transform 0.2s ease-in-out;
    transform: rotate(45deg);
  }
`;
