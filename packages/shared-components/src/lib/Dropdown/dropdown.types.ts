import { ContextMenuItem } from '../ContextMenu/contextMenu.types';

export interface DropdownItemWithId<T extends string | number = string | number>
  extends ContextMenuItem {
  id: T;
  name?: string;
}

export interface DropdownPropTypes<
  T extends string | number = string | number,
> {
  className?: string;
  placeholder?: string;
  menuItems: DropdownItemWithId<T>[];
  defaultItem?: DropdownItemWithId<T>;
}

export interface StyledDropdownPropTypes extends DropdownPropTypes {}
