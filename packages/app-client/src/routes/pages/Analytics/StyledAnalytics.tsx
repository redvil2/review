import { Theme, switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledAnalytics = styled.div<{
  $colorMode: ColorMode;
  $theme: Theme;
}>`
  background: ${({ $colorMode }) => switchColor($colorMode).surface2};
  width: 100%;

  .al-page-wrapper {
    display: flex;
    padding: 0 1rem;
  }
  .al-headline {
    color: ${({ $colorMode }) => switchColor($colorMode).onPrimaryContainer};
    margin: 2rem 0 2.5rem;
    z-index: 20;
  }

  .al-tab-buttons {
    z-index: 20;
  }

  .al-connect__description {
    color: ${({ $colorMode }) => switchColor($colorMode).secondary};
  }

  .al-no-data {
    color: ${({ $colorMode }) => switchColor($colorMode).onPrimaryContainer};
  }

  .al-analytics-card-title {
    color: ${({ $colorMode }) => switchColor($colorMode).secondary};
  }

  .al-qr-scans-data-headline {
    color: ${({ $colorMode }) => switchColor($colorMode).onPrimaryContainer};
    margin-bottom: 0.25rem;
    align-items: center;
    display: flex;
    justify-content: flex-start;
  }

  .al-period-subline {
    margin-bottom: 1.5rem;
  }

  .order-no {
    margin-bottom: 1rem;
    color: ${({ $colorMode }) => switchColor($colorMode).onPrimaryContainer};
  }

  .al-trend-badge {
    margin-left: 0.5rem;

    .material-symbols-rounded {
      font-size: 0.75rem;
    }
  }

  .al-empty-state {
    width: 100%;
    height: auto;
  }

  .icon-add-label {
    color: ${({ $colorMode }) => switchColor($colorMode).primary};
    cursor: pointer;
    margin-left: 1rem;
  }

  .al-card {
    margin-bottom: 1rem;
  }
`;
