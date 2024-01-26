import styled from 'styled-components';

export const StyledViewMembersPage = styled.div`
  background-color: ${({ theme }) => theme.colors.current.surface2};

  .al-current-members-count {
    color: ${({ theme }) => theme.colors.current.primary};
  }
`;
