import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { HStack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../Button/Button';
import { ContextMenu } from '../ContextMenu/ContextMenu';
import { ContextMenuItemWithId } from '../ContextMenu/contextMenu.types';
import { Icon } from '../Icon/Icon';
import { Subline } from '../Typography/Subline/Subline';

import { StyledPageHeader } from './StyledPageHeader';

export const PageHeader = ({
  btnLabel,
  btnRoute,
  onBtnClick,
  xRoute,
  onX,
  contextMenu,
  children,
  actionSlot,
  mainTitle,
}: {
  btnLabel?: string;
  btnRoute?: string;
  onBtnClick?: () => void;
  xRoute?: string;
  onX?: () => void;
  actionSlot?: ReactNode;
  contextMenu?: ContextMenuItemWithId[];
  children?: string;
  mainTitle?: boolean;
}) => {
  const navigate = useNavigate();
  const alignRight = !btnLabel && !btnRoute;
  return (
    <StyledPageHeader
      className={'al-page-header'}
      alignRight={alignRight}
      mainTitle={mainTitle}
    >
      {children && (
        <HStack
          className={'al-page-header-title'}
          justifyContent={mainTitle ? 'flex-start' : 'center'}
          alignItems={'center'}
          zIndex={0}
        >
          <Subline size={2} fontWeight={FONT_WEIGHT.MEDIUM}>
            {children}
          </Subline>
        </HStack>
      )}
      <HStack className={'al-page-header-actions'} w={'100%'}>
        {btnLabel && (btnRoute || onBtnClick) && (
          <Button
            variant={'link'}
            leftIcon={<Icon>navigate_before</Icon>}
            onClick={() => {
              onBtnClick && onBtnClick();
              btnRoute && navigate(btnRoute);
            }}
          >
            {btnLabel}
          </Button>
        )}
        {contextMenu && (
          <ContextMenu contextMenuItems={contextMenu} variant={'blueAndLeft'} />
        )}
        {actionSlot && (
          <span className={'al-page-header-action'}>{actionSlot}</span>
        )}
        {(xRoute || onX) && (
          <Button
            variant={'link'}
            leftIcon={<Icon>close</Icon>}
            onClick={() => {
              onX && onX();
              xRoute && navigate(xRoute);
            }}
          />
        )}
      </HStack>
    </StyledPageHeader>
  );
};
