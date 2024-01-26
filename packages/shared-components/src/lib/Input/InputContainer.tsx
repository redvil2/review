import { FormControl, FormControlOptions } from '@chakra-ui/form-control';
import { HTMLChakraProps, ThemingProps, forwardRef } from '@chakra-ui/system';
import cn from 'classnames';

import { InputWrapper } from './InputWrapper';

export interface InputContainerProps
  extends HTMLChakraProps<'div'>,
    FormControlOptions,
    ThemingProps<'A4Input'> {}

export const InputContainer = forwardRef<InputContainerProps, 'div'>(
  function InputContainer(props, ref) {
    const { children, className, ...rest } = props;

    const _className = cn(
      'a4-input__container',
      'a4-input__form-control',
      className,
    );

    return (
      <FormControl as={InputWrapper} ref={ref} className={_className} {...rest}>
        {children}
      </FormControl>
    );
  },
);
