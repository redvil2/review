import { switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledHomePage = styled.div<{ $colorMode: ColorMode }>`
  flex-grow: 1;
  .al-website__hero {
    img {
      height: 100%;
    }
  }
  img {
    object-fit: scale-down;
  }

  .al-website__hero-headline {
    color: ${({ $colorMode }) => switchColor($colorMode).primary};
    margin-bottom: 2rem;
  }

  .al-website__hero-text {
    color: ${({ $colorMode }) => switchColor($colorMode).primary};
    margin-bottom: 2rem;
  }

  //TODO: keep for v2

  /* padding: 0 1.5rem;
  .al-website__gradient-wrapper {
    margin: 0 -1.5rem;
    padding-left: 1.5rem;

    background: radial-gradient(
      circle at 0% 0%,
      rgba(230, 232, 244, 1) 50%,
      rgba(255, 255, 255, 1) 100%
    );




  }

  .al-website__bg-box {
    background: {({ $colorMode }) => switchColor($colorMode).surface};

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .al-website__bg-gradient {
    background: linear-gradient(
      344deg,
      rgba(231, 233, 245, 1) 0%,
      rgba(244, 243, 251, 1) 100%
    );

    &-reverse {
      background: linear-gradient(
        118deg,
        rgba(231, 233, 245, 1) 100%,
        rgba(244, 243, 251, 1) 100%
      );
    }
  }*/
`;
