import { switchColor } from '@app/shared/ui/theme';
import { HStack, useColorMode, VStack } from '@chakra-ui/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Icon } from '../..';
import { ContextMenuItemWithId } from '../ContextMenu/contextMenu.types';

export type DropdownMenuItem<T extends string | number> =
  ContextMenuItemWithId<T>;

const Container = styled(HStack)`
  width: 100%;
  button {
    align-items: center;
    color: ${({ theme }) => theme.colors.current.onPrimaryContainer};
    display: flex;
    font-size: 1.125rem;
    font-weight: 600;
    justify-content: center;
    &:focus {
      outline: 0;
    }
  }
`;

const Menu = styled(VStack)`
  color: ${({ theme }) => theme.colors.current.onPrimaryContainer};
  cursor: pointer;
  max-height: 50vh;
  overflow: auto;
  padding: 0.38rem;
  width: 100%;
  [role='menuitem'] {
    display: flex;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.75rem;
    padding: 0.25rem;
    width: 100%;
  }

  .material-symbols-rounded {
    color: ${({ theme }) => theme.colors.current.primary};
  }
  .modular-dropdown-menu {
    width: 100%;
  }

  .modular-dropdown-menu-item {
    .checkmark-icon {
      color: ${({ theme }) => theme.colors.current.primary};
    }
    padding-left: 0.62rem;
    width: 100%;
    button {
      padding-left: 0;
    }
    &:hover {
      background-color: ${({ theme }) => theme.colors.current.primaryContainer};
    }
  }
`;

export const useModularDropdown = <
  T extends string | number = string | number,
>({
  menuItems,
  defaultItem,
  displayValue,
  onChange,
  icon = 'expand_more',
  readOnly = false,
  withLabel = false,
}: {
  className?: string;
  placeholder?: string;
  menuItems: DropdownMenuItem<T>[];
  defaultItem?: DropdownMenuItem<T>;
  displayValue?: (value: T) => ReactNode;
  onChange?: (item: DropdownMenuItem<T>) => void;
  icon?: string | null;
  readOnly?: boolean;
  withLabel?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultItem);
  useEffect(() => {
    if (isOpen) {
      const handler = () => {
        setIsOpen(false);
      };
      setTimeout(() => {
        document.addEventListener('click', handler);
      }, 0);
      return () => document.removeEventListener('click', handler);
    }
  }, [isOpen]);
  useEffect(() => {
    if (selected) {
      onChange?.(selected);
    }
  }, [selected]);

  const handleClick = (item: DropdownMenuItem<T>) => {
    setSelected(item);
    setIsOpen(false);
    item.onClick?.();
  };

  const dropdown = (
    <Container
      className={`dropdown-container ${withLabel ? 'with-label' : ''}`}
      style={{ cursor: 'pointer' }}
      onClick={e => {
        setIsOpen(isOpen => !isOpen);
        e.stopPropagation();
      }}
    >
      <button type="button" className="modular-dropdown-button">
        {displayValue && selected
          ? displayValue(selected.id ?? '')
          : selected?.name}

        <Icon>{icon}</Icon>
      </button>
    </Container>
  );
  const menu = isOpen ? (
    <Menu className="modular-dropdown-menu" align="start" spacing={0}>
      {menuItems.map(item => (
        <HStack
          className="modular-dropdown-menu-item"
          justify={'space-between'}
          key={item.id}
        >
          <button
            onClick={() => handleClick(item)}
            type="button"
            role="menuitem"
          >
            {item.name}
          </button>
          {selected && selected.id === item.id ? (
            <Icon className="checkmark-icon">check</Icon>
          ) : null}
        </HStack>
      ))}
    </Menu>
  ) : null;
  const toggleDropdown = useCallback(() => {
    setIsOpen(value => !value);
  }, []);
  return { menu, dropdown, toggleDropdown, value: selected };
};
