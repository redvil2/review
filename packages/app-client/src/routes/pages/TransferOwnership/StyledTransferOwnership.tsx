import styled from 'styled-components';

export const StyledTransferOwnership = styled.div`
  background: ${({ theme }) => theme.colors.current.surface2};

  .al-card {
    width: 100%;

    &.card-invitee {
      .al-card-header__right-icon {
        color: ${({ theme }) => theme.colors.current.outlineVariant};
      }
    }
  }
`;
