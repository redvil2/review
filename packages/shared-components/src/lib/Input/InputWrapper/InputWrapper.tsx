import { useFormControlContext } from '@chakra-ui/form-control';
import {
  chakra,
  HTMLChakraProps,
  ThemingProps,
  forwardRef,
  useMultiStyleConfig,
  omitThemingProps,
} from '@chakra-ui/system';
import cn from 'classnames';
import { useEffect, useState } from 'react';

import { InputEditIcon } from './InputEditIcon';

interface InputWrapperOptions {
  hideEditIcon?: boolean;

  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

export interface InputWrapperProps
  extends HTMLChakraProps<'div'>,
    InputWrapperOptions,
    ThemingProps<'A4Input'> {}

export const InputWrapper = forwardRef<InputWrapperProps, 'div'>(
  function InputWrapper(props, ref) {
    const { children, className, hideEditIcon = false, id: _, ...rest } = props;
    const [hasDefaultValue, setHasDefaultValue] = useState<boolean>(
      !!props.defaultValue,
    );

    const ownProps = omitThemingProps(rest);

    const form = useFormControlContext() || {
      isDisabled: false,
      isReadOnly: false,
      isRequired: false,
      isFocused: false,
    };
    const { isDisabled, isReadOnly, isRequired, isFocused } = form;

    const styles = useMultiStyleConfig('A4Input', {
      ...props,
      isDisabled,
      isReadOnly,
      isRequired,
      isFocused,
    });

    const _className = cn('a4-input__wrapper', className);

    const showEditIcon =
      !hideEditIcon &&
      !form?.isDisabled &&
      !form?.isReadOnly &&
      !!hasDefaultValue;

    // TODO: replace later with more reliable way to check if input has default value
    useEffect(() => {
      const element = document.getElementById(form?.id);

      if (element) {
        setHasDefaultValue(!!element.getAttribute('value'));
      }
    }, [form?.id]);

    return (
      <chakra.div
        ref={ref}
        className={_className}
        __css={styles.wrapper}
        {...ownProps}
      >
        {children}
        {showEditIcon && <InputEditIcon />}
      </chakra.div>
    );
  },
);
