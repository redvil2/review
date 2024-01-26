import { EnumValues } from '@app/shared/type-util';

export const TAB_MENU_VARIANTS = {
  DEFAULT: 'default',
  SMALL: 'small',
};

export type TabMenuVariants = EnumValues<typeof TAB_MENU_VARIANTS>;
