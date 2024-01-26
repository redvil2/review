import {
  chakra,
  forwardRef,
  HTMLChakraProps,
  useMultiStyleConfig,
} from '@chakra-ui/system';
import cn from 'classnames';

export interface InputAddonProps extends HTMLChakraProps<'div'> {}

/**
 * InputAddon
 *
 * Element to append or prepend to an input
 */
export const InputAddon = forwardRef<InputAddonProps, 'div'>(
  function InputAddon(props, ref) {
    const { className, ...rest } = props;

    const _className = cn('a4-input__addon', className);
    const styles = useMultiStyleConfig('A4Input', props);

    return (
      <chakra.div
        ref={ref}
        className={_className}
        {...rest}
        __css={{
          ...styles.addon,
        }}
      />
    );
  },
);

InputAddon.displayName = 'A4InputAddon';

InputAddon.id = 'A4InputAddon';
