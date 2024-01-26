import { switchColor } from '@app/shared/ui/theme';
import { Skeleton, useColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

const StyledSwitchSkeleton = styled(Skeleton)`
  &.al-switch-skeleton {
    border-radius: 2rem;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      height: 16px;
      width: 16px;
      border-radius: 16px;
      background-color: white;
      visibility: visible;
      top: 2px;
      right: 2px;
    }
  }
`;

export const SwitchSkeleton = () => {
  const { colorMode } = useColorMode();
  return (
    <StyledSwitchSkeleton
      className={'al-switch-skeleton'}
      height="20px"
      width="34px"
      startColor={switchColor(colorMode).secondaryContainer}
    />
  );
};
