import {
  Icon,
  Paragraph,
  useModularDropdown,
  DropdownMenuItem,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { HStack, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { DropdownCardWrapper } from './dropdownCard.style';

export const DropdownCard = <T extends string | number>({
  defaultId,
  onChange,
  label,
  menuItems,
  leftIcon,
  rightIcon,
  readOnly,
}: {
  defaultId?: T;
  onChange?: (item: DropdownMenuItem<T>) => void;
  label?: string;
  menuItems: DropdownMenuItem<T>[];
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  readOnly?: boolean;
}) => {
  const { menu, dropdown, toggleDropdown } = useModularDropdown<T>({
    defaultItem: menuItems.find(({ id }) => id === defaultId),
    onChange,
    menuItems,
    icon: null,
    readOnly: false,
    withLabel: !!label,
  });
  return (
    <DropdownCardWrapper
      onClick={toggleDropdown}
      className="modular-dropdown-card"
      readOnly={readOnly}
    >
      <HStack alignItems="flex-start" spacing={0}>
        {leftIcon ? <Icon className="__left-icon">{leftIcon}</Icon> : null}
        <VStack
          spacing={0}
          alignItems="start"
          flexGrow={1}
          className={'modular-dropdown-menu-wrapper'}
        >
          {label ? (
            <Paragraph
              className="__label"
              size={2}
              fontWeight={FONT_WEIGHT.REGULAR}
            >
              {label}
            </Paragraph>
          ) : null}
          {menu ?? dropdown}
        </VStack>
        {menu
          ? null
          : readOnly
            ? null
            : rightIcon || <Icon className="__right-icon">edit</Icon>}
      </HStack>
    </DropdownCardWrapper>
  );
};
