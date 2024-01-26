import { useColorMode } from '@chakra-ui/react';
import React from 'react';

import { Icon } from '../Icon/Icon';

import { StyledLinkUnlinkIcon } from './StyledLinkUnlinkIcon';

export const LinkUnlinkIcon = ({ isLinked }: { isLinked: boolean }) => {
  const { colorMode } = useColorMode();
  return (
    <>
      {isLinked && (
        <StyledLinkUnlinkIcon
          className={'target-link-icon linked'}
          justifyContent={'center'}
          alignItems={'center'}
          $colorMode={colorMode}
        >
          <Icon>link</Icon>
        </StyledLinkUnlinkIcon>
      )}
      {!isLinked && (
        <StyledLinkUnlinkIcon
          className={'target-link-icon unlinked'}
          justifyContent={'center'}
          alignItems={'center'}
          $colorMode={colorMode}
        >
          <Icon>link_off</Icon>
        </StyledLinkUnlinkIcon>
      )}
    </>
  );
};
