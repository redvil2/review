import styled from 'styled-components';

export const StyledInviteUserPage = styled.div`
  background-color: ${({ theme }) => theme.colors.current.surface2};
  .w100 {
    width: 100%;
  }
  .self-center {
    align-self: center;
  }
  .spacing-8 {
    margin-top: 2rem;
  }
  .prefix-input.prefix-input {
    color: ${({ theme }) => theme.colors.current.secondary};
    padding-left: 0;
    .modular-dropdown-button {
      color: ${({ theme }) => theme.colors.current.secondary};
    }
  }
  .flag-wrapper {
    width: 1.2rem;
  }
  input::placeholder {
    color: ${({ theme }) => theme.colors.current.outlineVariant};
  }
  .a4-input__wrapper {
    padding: 0;
  }
  .edit-icon-addon.edit-icon-addon {
    padding-right: 0;
  }
  .edit-icon {
    color: ${({ theme }) => theme.colors.current.primary};
  }
  .__email-icon {
    font-size: 1.5rem;
  }
  .__phone-icon {
    font-size: 1.5rem;
  }

  .al-select-role-title {
    color: ${({ theme }) => theme.colors.current.onPrimaryContainer};
    margin-left: 0.25rem;
  }
`;
