import { switchColor } from '@app/shared/ui/theme';
import { Tabs } from '@chakra-ui/react';
import styled, { css } from 'styled-components';

import { StyledTabMenuPropTypes } from './tabMenu.types';
import { TAB_MENU_VARIANTS } from './tabMenu.variants';

export const StyledTabMenu = styled(Tabs)<StyledTabMenuPropTypes>`
  ${({ variant }) =>
    variant === TAB_MENU_VARIANTS.SMALL
      ? css`
          [role='tablist'] {
            border: transparent;
            gap: 0.5rem;
            button {
              flex: 1;
              border-radius: 6.5rem;
              height: 1.625rem;
              min-width: 3.6875rem;
              line-height: 1.625rem;
              font-size: 0.875rem;
              border: transparent;
              align-items: center;
              background-color: ${({ theme }) =>
                theme.colors.current.surfaceVariant};
              color: ${({ theme }) => theme.colors.current.secondary};
              &[aria-selected='true'] {
                color: ${({ theme }) => theme.colors.current.onPrimary};
                background-color: ${({ theme }) =>
                  theme.colors.current.onSecondaryContainer};
              }
            }
          }
        `
      : css`
          .al-tab-menu-icon-left,
          .al-tab-menu-icon-right {
            display: flex;
            align-items: center;
            margin-right: 0.25rem;

            .material-symbols-rounded {
              font-size: 1.25rem;
            }
          }

          .al-tab-menu-icon-right {
            margin-left: 0.25rem;
          }
        `}
`;
