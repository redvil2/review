import { useColorMode } from '@chakra-ui/react';
import React from 'react';

import { Icon } from '../Icon/Icon';

import { StyledBadge } from './badge.style';
import { BadgePropTypes } from './badge.types';

export const Badge: React.FC<BadgePropTypes> = ({
  className,
  children,
  iconName,
  noDot,
  ...rest
}) => {
  const { colorMode } = useColorMode();
  return (
    <StyledBadge
      className={`al-badge ${className ? className : ''}`}
      $colorMode={colorMode}
      {...rest}
    >
      {!noDot && <div className={'al-badge-dot'} />}
      {iconName && <Icon className={'al-badge-icon'}>{iconName}</Icon>}
      {children}
    </StyledBadge>
  );
};
