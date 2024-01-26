import {
  MenuButton as CMenuButton,
  MenuList as CMenuList,
  MenuItem as CMenuItem,
} from '@chakra-ui/react';
import React from 'react';

import { Icon } from '../Icon/Icon';

import { StyledContextMenu } from './contextMenu.style';
import { ContextMenuPropTypes } from './contextMenu.types';

export const ContextMenu: React.FC<ContextMenuPropTypes> = ({
  contextMenuItems,
  menuButton,
  variant,
  onMenuClick,
}) => (
  <StyledContextMenu variant={variant || 'blue'}>
    <CMenuButton
      className={'al-context-menu'}
      type="button"
      onClick={ev => {
        ev.stopPropagation();
        onMenuClick && onMenuClick();
      }}
    >
      {menuButton || <Icon>more_horiz</Icon>}
    </CMenuButton>
    <CMenuList>
      {contextMenuItems &&
        contextMenuItems.map((item, idx) => (
          <CMenuItem
            type="button"
            key={`${item.name}-${idx}`}
            onClick={!item.isDisabled ? item.onClick : undefined}
            isDisabled={item.isDisabled}
            className={`al-context-menu__item ${
              item.destructive && !item.isDisabled ? 'al-destructive' : ''
            }`}
            style={item.button ? { padding: '0.5rem' } : undefined}
          >
            {item.icon && (
              <span className={'al-context-menu__item-icon'}>{item.icon}</span>
            )}
            {item.button || item.name}
            {item.iconRight && (
              <span
                className={'al-context-menu__item-icon'}
                style={{ marginLeft: '0.25rem' }}
              >
                {item.iconRight}
              </span>
            )}
          </CMenuItem>
        ))}
    </CMenuList>
  </StyledContextMenu>
);
