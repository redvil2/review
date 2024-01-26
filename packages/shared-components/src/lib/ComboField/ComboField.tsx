import { Box, HStack } from '@chakra-ui/react';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';

import { Card, Icon, Loader } from '@app/shared/ui/components';

import { StyledComboField } from './comboField.style';
import { ComboFieldPropTypes } from './comboField.types';

export const ComboField: FC<ComboFieldPropTypes> = ({
  placeholder,
  value,
  onInput,
  isLoading,
  children,
  showBody,
  minCharLength = 3,
  debounce = 1000,
  invokeCall,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderString, setPlaceholderString] = useState(placeholder);
  const debounceTimeout = useRef<null | number>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  let reset = false;
  const handleFocus = () => {
    setIsFocused(true);
    reset && (reset = false);
    setTimeout(() => {
      setPlaceholderString('');
    }, 100);
  };

  const handleBlur = () => {
    if (!reset && !showBody && !value) {
      setIsFocused(false);
      setPlaceholderString(placeholder);
    }
  };

  const handleInput = (ev: ChangeEvent<HTMLInputElement>) => {
    onInput && onInput(ev);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (ev.target.value.length >= minCharLength) {
        invokeCall && invokeCall();
      }
    }, debounce) as unknown as number;
  };

  const handleReset = ev => {
    ev.preventDefault();
    inputRef.current?.focus();
    onInput &&
      onInput({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);
  return (
    <Card className={'al-combo-field'}>
      <StyledComboField>
        <HStack
          className={`al-combo-field-wrapper ${
            isFocused || reset ? 'al-focussed' : ''
          }`}
        >
          <input
            className={'al-combo-field-input'}
            ref={inputRef}
            placeholder={placeholderString}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            onInput={handleInput}
          />
          <Icon className={'al-combo-field-icon-search'}>search</Icon>
          {isLoading ? (
            <Loader size={5} />
          ) : (
            value !== '' && (
              <Icon
                className={'al-combo-field-icon-cancel'}
                onMouseDown={handleReset}
              >
                cancel
              </Icon>
            )
          )}
        </HStack>
        {showBody && <Box>{children}</Box>}
      </StyledComboField>
    </Card>
  );
};
