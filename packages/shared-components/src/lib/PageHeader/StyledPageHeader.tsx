import { FONT_WEIGHT, headline4 } from '@app/shared/ui/theme';
import styled from 'styled-components';

export const StyledPageHeader = styled.div<{
  alignRight: boolean;
  mainTitle?: boolean;
}>`
  display: flex;
  position: relative;
  min-height: 2.75rem;

  .al-page-header-title {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    color: ${({ theme, mainTitle }) =>
      theme.colors.current[mainTitle ? 'primary' : 'onPrimaryContainer']};

    .al-subline {
      ${({ mainTitle }) => mainTitle && headline4(FONT_WEIGHT.MEDIUM)}
    }
  }

  .al-page-header-actions {
    position: relative;
    justify-content: ${({ alignRight }) =>
      alignRight ? 'flex-end' : 'space-between'};
    align-items: center;
    z-index: 100;

    .al-page-header-action {
      margin-top: 0.2rem;
    }
  }
`;
