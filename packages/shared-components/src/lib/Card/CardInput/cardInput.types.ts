import { ColorMode } from '@chakra-ui/react';
import React, { ChangeEvent, FocusEvent, ReactNode } from 'react';

import { DropdownItemWithId } from '../../Dropdown/dropdown.types';

export interface CardInputPropTypes {
  className?: string;
  leftMenu?: {
    menuItems: DropdownItemWithId[];
    defaultItem?: DropdownItemWithId;
    placeholder?: string;
  };
  genericSlot?: React.ReactNode;
  leftIconName?: string;
  leftIcon?: ReactNode;
  input: {
    placeholder?: string;
    inputValue?: string | undefined;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    label?: string;
    helperText?: string;
    errorMessage?: string;
    className?: string;
    name?: string;
    ref?: any;
  };
  rightMenu?: {
    menuItems: DropdownItemWithId[];
    defaultItem?: DropdownItemWithId;
    placeholder?: string;
  };
  isInvalid?: boolean;
  readOnly?: boolean;
  hideEditIndicator?: boolean;
  showLoader?: boolean;
  rightIconName?: string;
  iconOnClick?: () => void;
}

export interface StyledCardInputPropTypes
  extends Omit<CardInputPropTypes, 'input'> {
  $colorMode: ColorMode;
  $filledInput: boolean;
  $readonly: boolean;
}
