import { ReactNode } from 'react';

export type ContextMenuItem = {
  name?: string | JSX.Element;
  button?: ReactNode;
  id: string | number;
  icon?: ReactNode;
  iconRight?: ReactNode;
  onClick?: () => void;
  destructive?: boolean;
  isDisabled?: boolean;
};

export interface ContextMenuItemWithId<
  T extends string | number = string | number,
> extends ContextMenuItem {
  id: T;
}

export interface ContextMenuPropTypes {
  contextMenuItems: ContextMenuItem[];
  menuButton?: ReactNode;
  variant?: 'blue' | 'alignLeft' | 'blueAndLeft';
  onMenuClick?: () => void;
}

export interface StyledContextMenuPropTypes {}
