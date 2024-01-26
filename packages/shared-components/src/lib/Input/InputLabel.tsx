import { useFormControlContext } from '@chakra-ui/form-control';
import {
  HTMLChakraProps,
  ThemingProps,
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig,
} from '@chakra-ui/system';
import cn from 'classnames';

export interface InputLabelProps
  extends HTMLChakraProps<'label'>,
    ThemingProps<'InputLabel'> {}

export const InputLabel = forwardRef<InputLabelProps, 'label'>((props, ref) => {
  const styles = useMultiStyleConfig('A4Input', props);
  const filteredProps = omitThemingProps(props);

  const { className, children, ...rest } = filteredProps;

  const field = useFormControlContext();
  const ownProps = field?.getLabelProps(rest, ref) ?? { ref, ...rest };

  const _className = cn('a4-input__label', className);

  return (
    <chakra.label
      ref={ref}
      {...ownProps}
      className={_className}
      __css={{
        ...styles.textElement,
        ...styles.label,
      }}
    >
      {children}
    </chakra.label>
  );
});

InputLabel.displayName = 'A4InputLabel';

InputLabel.id = 'A4InputLabel';
