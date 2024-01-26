import { FONT_WEIGHT, subline2 } from '@app/shared/ui/theme';
import styled from 'styled-components';

export const StyledComboField = styled.div`
  .al-combo-field {
    &-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.al-focussed {
        .al-combo-field-icon-search {
          right: calc(100% - 22px);
        }
      }
    }
    &-input {
      background-color: ${({ theme }) => theme.colors.current.surface};
      ${subline2(FONT_WEIGHT.SEMI_BOLD)};
      flex-grow: 1;
      padding-left: 30px;
      position: relative;
      transition: padding-left 0.2s ease;

      &:focus {
        outline: none;
      }
    }

    &-icon-search {
      color: ${({ theme }) => theme.colors.current.primary};
      position: absolute;
      right: 10px;
      transition: all 0.2s ease;
    }

    &-icon-cancel {
      font-size: 1rem;
      color: ${({ theme }) => theme.colors.current.outlineVariant};
    }
  }
`;
