import {
  AvatarGroup as CAvatarGroup,
  AvatarGroupProps,
} from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledAvatarGroup = styled(CAvatarGroup)<AvatarGroupProps>`
  &.al-clickable {
    cursor: pointer;
  }
`;
