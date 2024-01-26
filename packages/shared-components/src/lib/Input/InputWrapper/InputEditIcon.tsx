import {
  chakra,
  forwardRef,
  HTMLChakraProps,
  ThemingProps,
  useMultiStyleConfig,
  omitThemingProps,
} from '@chakra-ui/system';
import cn from 'classnames';

export interface InputEditIconProps
  extends HTMLChakraProps<'span'>,
    ThemingProps<'A4Input'> {}

export const InputEditIcon = forwardRef<InputEditIconProps, 'span'>(
  function InputEditIcon(props, ref) {
    const { className, ...rest } = props;
    const styles = useMultiStyleConfig('A4Input', props);
    const ownProps = omitThemingProps(rest);

    const _className = cn(
      'a4-input__edit-icon',
      'material-symbols-rounded',
      className,
    );

    return (
      <chakra.span
        ref={ref}
        className={_className}
        __css={{
          ...styles.editIcon,
        }}
        {...ownProps}
      >
        edit
      </chakra.span>
    );
  },
);
