import { accordionTheme } from './Accordion';
import { avatarTheme } from './Avatar';
import { Badge } from './Badge';
import { Button } from './Button';
import { cardTheme } from './Card';
import { Checkbox } from './Checkbox';
import { contextMenuTheme } from './ContextMenu';
import { Input } from './Input';
import { modalTheme } from './Modal';
import { Radio } from './Radio';
import { selectTheme } from './Select';
import { Switch } from './Switch';
import { tabsTheme } from './TabMenu';
import { tooltipTheme } from './Tooltip';

export const components = {
  Accordion: accordionTheme,
  Avatar: avatarTheme,
  ...Badge,
  ...Button,
  Card: cardTheme,
  ...Checkbox,
  Menu: contextMenuTheme,
  Modal: modalTheme,
  ...Input,
  ...Radio,
  ...Switch,
  Select: selectTheme,
  Tabs: tabsTheme,
  Tooltip: tooltipTheme,
};

export * from './Input';
