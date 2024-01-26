import { ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

import GlobeDark from '../../images/globe_dark.svg';
import GlobeLight from '../../images/globe_light.svg';

export const StyledLanguages = styled.div<{ $colorMode: ColorMode }>`
  &.al-website__languages {
    display: flex;
    justify-content: center;
    width: 100vw;
    min-height: 100vh;

    .al-headline {
      margin-top: 4rem;
    }

    .al-website__close {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }

    .al-website__languages__grid {
      flex-grow: 1;

      background-image: url(${props =>
        props.$colorMode === 'light' ? GlobeLight : GlobeDark});

      background-size: 130%;
      background-repeat: no-repeat;
      background-position: center top;

      @media (min-width: 480px) {
        background-size: contain;
      }
    }
  }
`;
