import {
  Select as CSelect,
  Menu as CMenu,
  MenuButton as CMenuButton,
  MenuList as CMenuList,
  MenuItem as CMenuItem,
} from '@chakra-ui/react';
import { FC, useCallback, useRef, useState } from 'react';

import { StyledDropdown } from './dropdown.style';
import { DropdownPropTypes, DropdownItemWithId } from './dropdown.types';

export const Dropdown: FC<DropdownPropTypes> = ({
  className,
  menuItems,
  defaultItem,
  placeholder,
}) => {
  const [selected, setSelected] = useState(defaultItem);
  const [filterValue, setFilterValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (item: DropdownItemWithId) => {
    setSelected(item);
    item.onClick && item.onClick();
  };

  const handleFocus = useCallback((e: FocusEvent) => {
    if (e.target !== inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  const handleMenuOpen = () => {
    document.addEventListener('focus', handleFocus, true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  };

  const handleMenuClose = () => {
    document.removeEventListener('focus', handleFocus, true);
    setFilterValue('');
  };

  const handleFilterItems = item => {
    return item.name.toLowerCase().includes(filterValue.toLowerCase());
  };

  return (
    <StyledDropdown className={className ?? ''}>
      <input
        className="al-dropdown__input"
        ref={inputRef}
        value={filterValue}
        onChange={e => setFilterValue(e.target.value)}
      />
      <CMenu onOpen={handleMenuOpen} onClose={handleMenuClose}>
        <CMenuButton>
          <CSelect
            placeholder={selected?.name || placeholder}
            variant="unstyled"
          />
        </CMenuButton>
        <CMenuList>
          {menuItems.filter(handleFilterItems).map(item => (
            <CMenuItem key={item.id} onClick={() => handleClick(item)}>
              {item.name}
            </CMenuItem>
          ))}
        </CMenuList>
      </CMenu>
    </StyledDropdown>
  );
};
