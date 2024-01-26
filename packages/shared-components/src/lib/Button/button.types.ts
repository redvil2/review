import { ColorMode } from '@chakra-ui/react';
import { CSSProperties, PropsWithChildren, ReactNode } from 'react';

export type variants = 'primary' | 'secondary' | 'link';

type size = 'small' | 'medium' | 'large' | 'xlarge';

export type ButtonPropTypes = PropsWithChildren<{
  type?: string;
  variant?: variants;
  size?: size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  wide?: boolean;
  isDisabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  error?: boolean;
  style?: CSSProperties;
}>;

export interface StyledButtonPropTypes extends ButtonPropTypes {
  $colorMode: ColorMode;
  $error: boolean;
  $children: boolean;
}
