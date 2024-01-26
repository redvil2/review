import { AvatarGroupProps } from '@chakra-ui/react';
import { FC } from 'react';

import { StyledAvatarGroup } from './avatarGroup.styles';

export const AvatarGroup: FC<AvatarGroupProps> = ({
  children,
  size,
  max,
  ...rest
}) => {
  return (
    <StyledAvatarGroup
      className={`al-avatar-group ${rest.onClick ? 'al-clickable' : ''}`}
      size={size}
      max={max || 3}
      {...rest}
    >
      {children}
    </StyledAvatarGroup>
  );
};
