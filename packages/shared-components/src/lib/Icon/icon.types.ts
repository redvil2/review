import { ColorMode } from '@chakra-ui/react';
import { PropsWithChildren, MouseEvent, RefObject, ForwardedRef } from 'react';

export type IconPropTypes = PropsWithChildren<{
  // TODO: add icon names as type
  className?: string;
  app?: boolean;
  style?: React.CSSProperties;
  $colorMode?: ColorMode;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onMouseDown?: (e: MouseEvent<HTMLElement>) => void;
}>;

export interface StyledIconPropTypes extends IconPropTypes {
  $app: boolean;
  $colorMode: ColorMode;
  ref: ForwardedRef<HTMLElement>;
}
