import { ColorMode } from '@chakra-ui/react';
import { ReactElement, ReactNode } from 'react';

import { CardFooterPropTypes } from '../CardFooter/cardFooter.types';
import { CardHeaderPropTypes } from '../CardHeader/cardHeader.types';
import { CardInputPropTypes } from '../CardInput/cardInput.types';

export interface CardNonGenericPropTypes {
  children?: ReactNode;
  header?: ReactElement<CardHeaderPropTypes>;
  input?: ReactElement<CardInputPropTypes>;
  footer?: ReactElement<CardFooterPropTypes>;
  readOnly?: boolean;
  onClick?: () => void;
  className?: string;
  first?: boolean;
  noPadding?: boolean;
  zIndex?: number;
}

export interface CardPropTypes<T> extends CardNonGenericPropTypes {
  id?: T;
  selected?: T | null;
  onSelect?: (id: T) => void;
}

export interface StyledNonGenericCardPropTypes extends CardNonGenericPropTypes {
  $first?: boolean;
  $noPadding?: boolean;
  $colorMode: ColorMode;
  $zIndex?: number;
}

export type StyledCardPropTypes<T> = CardPropTypes<T> &
  StyledNonGenericCardPropTypes;
