import { switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledProjectDetails = styled.div<{ $colorMode: ColorMode }>`
  background: ${({ $colorMode }) => switchColor($colorMode).surface2};

  .btn-share {
    position: relative;
    z-index: 1;
    border: 2px solid ${({ $colorMode }) => switchColor($colorMode).surface2};

    &:hover {
      border: 2px solid ${({ $colorMode }) => switchColor($colorMode).surface2};
    }
  }

  .al-avatar-group {
    position: relative;
    z-index: 0;
  }

  .al-card {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 3rem;
    }
  }

  .al-empty-state-text {
    color: ${({ $colorMode }) => switchColor($colorMode).secondary};
  }

  .al-connect-icon {
    color: ${({ $colorMode }) => switchColor($colorMode).secondary};
    &.link {
      color: ${({ $colorMode }) => switchColor($colorMode).primary};
    }
  }

  .al-context-menu > span {
    display: flex;
    align-items: center;
  }

  .chakra-card__body {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .al-detail-stats {
    color: ${({ $colorMode }) => switchColor($colorMode).secondary};

    .icon-all-labels {
      height: 1.5rem;
    }

    .icon-preview-qr {
      margin-right: 0.25rem;
      height: 1.2rem;
      width: 1.2rem;
      font-size: 1.2rem;
    }
  }

  .al-visits-text {
    color: ${({ $colorMode }) => switchColor($colorMode).secondary};
  }

  .__menu_icon {
    font-size: 1.25rem;
  }
`;
