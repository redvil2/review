import { Box, Textarea } from '@chakra-ui/react';
import { ChangeEvent, FocusEvent, FormEvent, forwardRef, Ref } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import { useTheme } from 'styled-components';

import { Icon } from '../..';
import { useInputIcon } from '../hooks';

import { StyledResizableTextArea } from './resizeableTextarea.style';

export const ResizableTextArea = forwardRef(
  (
    {
      value,
      onChange,
      onInput,
      onBlur,
      name,
      placeholder,
    }: {
      value?: string;
      onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
      onInput?: (e: FormEvent<HTMLTextAreaElement>) => void;
      onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
      name?: string;
      placeholder?: string;
    },
    ref: Ref<HTMLTextAreaElement>,
  ) => {
    const { register, icon } = useInputIcon<HTMLTextAreaElement>();
    const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
      if (onBlur) {
        onBlur(e);
      }
      const registerBlur = register({ onBlur }).onBlur;
      if (registerBlur) {
        registerBlur(e);
      }
    };
    const theme = useTheme();
    return (
      <StyledResizableTextArea flexGrow={1} width="100%">
        <Textarea
          ref={ref}
          name={name}
          width="100%"
          onChange={onChange}
          onInput={onInput}
          value={value}
          variant="unstyled"
          minH="unset"
          overflow="hidden"
          w="100%"
          resize="none"
          minRows={1}
          transition="height none"
          placeholder={placeholder}
          onBlur={handleBlur}
          as={ResizeTextarea}
        />
        <Box flexGrow={0} visibility={icon === 'none' ? 'hidden' : 'visible'}>
          <Icon style={{ color: theme.colors.current.primary }}>
            {icon === 'none' ? 'edit' : icon}
          </Icon>
        </Box>
      </StyledResizableTextArea>
    );
  },
);
