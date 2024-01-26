import cn from 'classnames';
import { ComponentProps } from 'react';

import { StyledFromErrorMessage } from './formErrorMessage.style';

export const FormErrorMessage = ({
  children,
  className,
  ...props
}: ComponentProps<typeof StyledFromErrorMessage>) => (
  <StyledFromErrorMessage
    {...props}
    className={cn(className, '__error-message', 'chakra-form__error-message')}
  >
    {children}
  </StyledFromErrorMessage>
);
