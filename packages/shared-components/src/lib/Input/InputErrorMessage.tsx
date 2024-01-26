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

export interface InputErrorMessageProps
  extends HTMLChakraProps<'div'>,
    ThemingProps<'InputErrorMessage'> {}

export const InputErrorMessage = forwardRef<InputErrorMessageProps, 'div'>(
  function InputErrorMessage(props, ref) {
    const styles = useMultiStyleConfig('A4Input', props);
    const ownProps = omitThemingProps(props);
    const field = useFormControlContext();

    const _className = cn('chakra-input__error-message', props.className);

    if (!field?.isInvalid) return null;

    return (
      <chakra.div
        {...(field?.getErrorMessageProps(ownProps, ref) ?? {
          ref,
          ...ownProps,
        })}
        __css={{
          ...styles.textElement,
          ...styles.errorMessage,
        }}
        {...ownProps}
        className={_className}
      />
    );
  },
);

InputErrorMessage.displayName = 'A4InputErrorMessage';

InputErrorMessage.id = 'A4InputErrorMessage';
