import { useColorMode } from '@chakra-ui/react';
import React from 'react';

import { StyledAvatar } from './avatar.style';
import { AvatarPropTypes } from './avatar.types';
import { AVATAR_VARIANTS, avatarColors } from './avatar.variants';

export const Avatar: React.FC<AvatarPropTypes> = ({
  variant = AVATAR_VARIANTS.SURFACE,
  children,
  className,
  src,
  borderColor,
  ...rest
}) => {
  const { colorMode } = useColorMode();

  return (
    <StyledAvatar
      className={`al-avatar ${className ? className : ''}`}
      bg={avatarColors(colorMode)[variant].background}
      $colorMode={colorMode}
      name={children}
      variant={src ? AVATAR_VARIANTS.SURFACE : variant}
      src={src}
      borderColor={borderColor}
      {...rest}
    />
  );
};
