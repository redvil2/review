import styled from 'styled-components';

export const StyledAddDomain = styled.div`
  background-color: ${({ theme }) => theme.colors.current.surface2};

  .al-page-wrapper {
    display: flex;
    flex-direction: column;

    .al-dimmer {
      width: 100%;
    }

    .al-headline {
      margin: 0 0 1rem;
    }

    .al-card {
      width: 100%;
    }

    .al-save {
      margin-top: 1.5rem;
    }
  }
`;
