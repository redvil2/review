import {
  chakra,
  HTMLChakraProps,
  ThemingProps,
  forwardRef,
  useMultiStyleConfig,
} from '@chakra-ui/system';
import cn from 'classnames';

export interface InputFieldProps
  extends HTMLChakraProps<'div'>,
    ThemingProps<'A4Input'> {}

export const InputField = forwardRef<InputFieldProps, 'div'>(
  function InputField(props, ref) {
    const styles = useMultiStyleConfig('A4Input', props);

    const { children, className, ...rest } = props;

    const _className = cn('a4-input__field', className);

    return (
      <chakra.div
        ref={ref}
        className={_className}
        __css={{
          ...styles.field,
        }}
        {...rest}
      >
        {children}
      </chakra.div>
    );
  },
);
