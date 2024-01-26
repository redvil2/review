import styled from 'styled-components';

export const StyledWhatsNew = styled.div`
  margin: 0 2rem;
  padding: 2rem 0;

  .al-website-date {
    color: ${({ theme }) => theme.colors.current.primary};
  }

  ul {
    list-style-type: none;

    li {
      position: relative;
      padding-left: 1.5rem;

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        font-size: 2.5rem;
        color: black;
      }
    }
  }
`;
