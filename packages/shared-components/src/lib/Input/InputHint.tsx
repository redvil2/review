import { useFormControlContext } from '@chakra-ui/form-control';
import {
  HTMLChakraProps,
  ThemingProps,
  chakra,
  forwardRef,
  useMultiStyleConfig,
} from '@chakra-ui/system';
import cn from 'classnames';

export interface InputHintProps
  extends HTMLChakraProps<'div'>,
    ThemingProps<'InputHint'> {}

export const InputHint = forwardRef<InputHintProps, 'div'>(
  function InputHint(props, ref) {
    const field = useFormControlContext();
    const styles = useMultiStyleConfig('A4Input', props);

    const { className, ...rest } = props;

    const _className = cn('chakra-input__hint', className);

    return (
      <chakra.div
        ref={ref}
        __css={{
          ...styles.textElement,
          ...styles.hint,
        }}
        {...(field?.getHelpTextProps(rest, ref) ?? { ref, ...rest })}
        className={_className}
      />
    );
  },
);

InputHint.displayName = 'A4InputHint';

InputHint.id = 'A4InputHint';
