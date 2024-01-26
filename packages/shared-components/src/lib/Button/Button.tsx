import { useColorMode } from '@chakra-ui/react';
import cn from 'classnames';
import React from 'react';

import { StyledButton } from './button.style';
import { ButtonPropTypes } from './button.types';

export const Button: React.FC<ButtonPropTypes> = ({
  children,
  className,
  error,
  ...rest
}) => {
  const { colorMode } = useColorMode();
  return (
    <StyledButton
      className={cn('al-button', className)}
      $colorMode={colorMode}
      $error={error}
      $children={Boolean(children)}
      {...rest}
    >
      <span className={'al-button__text'}>{children}</span>
    </StyledButton>
  );
};
