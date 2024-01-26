import styled from 'styled-components';

export const StyledHeaderFooter = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .fake-button {
    line-height: 1.5rem;
    border-radius: 1.5rem;
    font-weight: 500;
    padding: 10px 16px;
    font-size: 1rem;
    height: 2.75rem;
    border-color: #395ba9;

    &.primary {
      color: #ffffff;
      background-color: #395ba9;

      &:hover {
        background-color: #002c71;
        border-color: #002c71;
      }
    }

    &.secondary {
      color: #395ba9;
      border-width: 1px;

      &:hover {
        background: #dce2f9;
      }
    }
  }

  .al-website__header {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .al-website__menu {
      button {
        margin-left: 0.5rem;

        &.al-link {
          margin: 0 1rem;
        }
      }
      .active .al-link {
        border-bottom: 1px solid #002c71;
      }
    }
  }

  .al-website__footer-menu {
    button {
      margin-left: 2rem;

      .al-button__text {
        .material-symbols-rounded {
          vertical-align: bottom;
          margin-right: 0.2rem;
        }
      }
    }
  }
`;
