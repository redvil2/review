import {
  Input as CInput,
  FormControl as CFormControl,
  FormLabel as CFormLabel,
  FormHelperText as CFormHelperText,
  useColorMode,
} from '@chakra-ui/react';
import cn from 'classnames';
import { FC, MouseEvent } from 'react';

import { FormErrorMessage, Dropdown } from '../../..';
import { useInputIcon } from '../../hooks';
import { Icon } from '../../Icon/Icon';
import { Loader } from '../../Loader/Loader';

import { StyledCardInput } from './cardInput.style';
import { CardInputPropTypes } from './cardInput.types';

export const CardInput: FC<CardInputPropTypes> = ({
  leftMenu,
  leftIcon,
  leftIconName,
  genericSlot,
  input,
  rightMenu,
  isInvalid,
  readOnly = false,
  hideEditIndicator = false,
  showLoader = false,
  className = '',
  rightIconName,
  iconOnClick,
}) => {
  const { colorMode } = useColorMode();
  const { icon, register } = useInputIcon<HTMLInputElement>({
    customIcon: rightIconName,
  });
  const handleIconClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    iconOnClick?.();
  };

  return (
    <StyledCardInput
      className={cn('card-input', className)}
      $colorMode={colorMode}
      $filledInput={input.inputValue !== null}
      $readonly={readOnly}
    >
      {leftMenu && (
        <Dropdown
          className={'card-input__left-menu'}
          menuItems={leftMenu.menuItems}
          placeholder={leftMenu.placeholder}
          defaultItem={leftMenu.defaultItem}
        />
      )}
      {genericSlot && (
        <span className={'card-input__generic-slot'}>{genericSlot}</span>
      )}
      {leftIcon && <span className={'card-input__left-icon'}>{leftIcon}</span>}
      {leftIconName && (
        <Icon className={'card-input__left-icon'}>{leftIconName}</Icon>
      )}
      {input && (
        <CFormControl
          className={'card-input__text-field'}
          isInvalid={isInvalid}
        >
          {input.label && <CFormLabel>{input.label}</CFormLabel>}
          <CInput
            name={input.name}
            placeholder={input.placeholder}
            value={input.inputValue}
            onChange={input.onChange}
            {...register({ onBlur: input.onBlur })}
            variant="unstyled"
            isReadOnly={readOnly}
            className={input.className}
            ref={input.ref}
          />
          {input.helperText && !isInvalid && (
            <CFormHelperText>{input.helperText}</CFormHelperText>
          )}
          {isInvalid && (
            <FormErrorMessage>{input.errorMessage}</FormErrorMessage>
          )}
        </CFormControl>
      )}
      {showLoader && <Loader size={5} />}
      {!hideEditIndicator && !readOnly && icon !== 'none' && (
        <Icon className={'card-input__indicator'} onClick={handleIconClick}>
          {icon}
        </Icon>
      )}
      {rightMenu && (
        <Dropdown
          className={'card-input__right-menu'}
          menuItems={rightMenu.menuItems}
          placeholder={rightMenu.placeholder}
          defaultItem={rightMenu.defaultItem}
        />
      )}
    </StyledCardInput>
  );
};
