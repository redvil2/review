import { FormControlOptions, useFormControl } from '@chakra-ui/form-control';
import {
  chakra,
  forwardRef,
  omitThemingProps,
  ThemingProps,
  useMultiStyleConfig,
  HTMLChakraProps,
} from '@chakra-ui/system';
import cn from 'classnames';

import { InputWrapper } from './InputWrapper';

type Omitted = 'disabled' | 'required' | 'readOnly' | 'size';

export interface InputProps
  extends Omit<HTMLChakraProps<'input'>, Omitted>,
    ThemingProps<'A4Input'>,
    FormControlOptions {}

/**
 * Input
 *
 * Element that allows users enter single valued data.
 *
 * @see Docs https://chakra-ui.com/docs/components/input
 */
export const Input = forwardRef<InputProps, 'input'>(
  function Input(props, ref) {
    const styles = useMultiStyleConfig('A4Input', props);

    const ownProps = omitThemingProps(props);
    const input = useFormControl<HTMLInputElement>(ownProps);
    const _className = cn('a4-input-input', props.className);

    return (
      <InputWrapper {...input}>
        <chakra.input
          ref={ref}
          __css={{ ...styles.input }}
          className={_className}
          {...input}
        />
      </InputWrapper>
    );
  },
);
