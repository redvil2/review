import { Tab as CTab, TabList as CTabList } from '@chakra-ui/react';
import { FC } from 'react';

import { StyledTabMenu } from './tabMenu.style';
import { TabMenuPropTypes, TabProps } from './tabMenu.types';
import { TAB_MENU_VARIANTS } from './tabMenu.variants';

export const Tab: FC<TabProps> = ({
  iconLeft,
  iconRight,
  children,
  ...rest
}) => (
  <CTab {...rest}>
    {iconLeft && <span className={'al-tab-menu-icon-left'}>{iconLeft}</span>}
    <span>{children}</span>
    {iconRight && <span className={'al-tab-menu-icon-right'}>{iconRight}</span>}
  </CTab>
);

export const TabList = ({ ...rest }) => <CTabList {...rest} />;

export const TabMenu: FC<TabMenuPropTypes> = ({ variant, ...rest }) => (
  <StyledTabMenu variant={variant || TAB_MENU_VARIANTS.DEFAULT} {...rest} />
);
