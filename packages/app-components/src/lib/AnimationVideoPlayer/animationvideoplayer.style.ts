import { Box } from '@chakra-ui/react';
import styled from 'styled-components';

export const VideoPlayerWrapper = styled(Box)`
  color: ${({ theme }) => theme.colors.current.onPrimaryContainer};
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 0;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
  user-select: none;

  video {
    object-fit: cover;
    width: auto;
    height: 100%;
    position: absolute;
  }
`;
