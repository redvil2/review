import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { useColorMode } from '@chakra-ui/react';
import React from 'react';

import { Avatar } from '../../Avatar/Avatar';
import { Button } from '../../Button/Button';
import { ContextMenu } from '../../ContextMenu/ContextMenu';
import { Icon } from '../../Icon/Icon';
import { Switch } from '../../Switch/Switch';
import { Paragraph } from '../../Typography/Paragraph/Paragraph';
import { Subline } from '../../Typography/Subline/Subline';

import { StyledCardHeader } from './cardHeader.style';
import { CardHeaderPropTypes } from './cardHeader.types';

export const CardHeader: React.FC<CardHeaderPropTypes> = ({
  children,
  showDragIndicator,
  leftIcon,
  xlIcon,
  appIcon,
  genericSlot,
  titleIcon,
  avatar,
  toggle,
  button,
  rightIcon,
  contextMenuItems,
  contextMenuVariant,
  onClick,
  subtitle,
  disabled,
  style,
  onMenuClick,
}) => {
  const { colorMode } = useColorMode();
  return (
    <StyledCardHeader
      className={'al-card-header'}
      $colorMode={colorMode}
      $disabled={disabled}
      onClick={onClick}
      style={style}
    >
      <div className={'al-card-header__front'}>
        {showDragIndicator ? (
          <Icon
            className={`al-card-header__left-icon al-drag ${
              xlIcon ? 'al-big' : ''
            }`}
          >
            drag_indicator
          </Icon>
        ) : (
          leftIcon && (
            <Icon
              className={`al-card-header__left-icon  ${xlIcon ? 'al-big' : ''}`}
            >
              {leftIcon}
            </Icon>
          )
        )}
        {appIcon && (
          <Icon className={'al-card-header__app-icon'} app>
            {appIcon}
          </Icon>
        )}
        {avatar && (
          <Avatar
            className={'al-card-header__avatar'}
            variant={avatar.variant}
            src={avatar.src}
          >
            {avatar.name}
          </Avatar>
        )}
        {genericSlot && (
          <span className={'al-card-header__generic-slot'}>{genericSlot}</span>
        )}
        <span className={'al-card-header__title'}>
          <span className={'al-card-header__title-box'}>
            <Subline size={2} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
              {children}
            </Subline>
            {titleIcon && (
              <Icon className={'al-card-header__title-icon'}>{titleIcon}</Icon>
            )}
          </span>
          {subtitle && (
            <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
              {subtitle}
            </Paragraph>
          )}
        </span>
      </div>
      <div className={'al-card-header__back'}>
        {button && (
          <Button
            onClick={button.onClick}
            size={'small' || button.size}
            variant={button.variant}
            leftIcon={
              button.iconName ? <Icon>{button.iconName}</Icon> : undefined
            }
          >
            {button.label && button.label}
          </Button>
        )}
        {rightIcon && (
          <Icon
            className={'al-card-header__right-icon'}
            onClick={rightIcon.onClick}
          >
            {rightIcon.name}
          </Icon>
        )}
        {contextMenuItems && (
          <ContextMenu
            contextMenuItems={contextMenuItems}
            variant={contextMenuVariant}
            onMenuClick={onMenuClick && onMenuClick}
          />
        )}
        {toggle && (
          <Switch
            defaultChecked={toggle.defaultChecked}
            isChecked={toggle.isChecked}
            onChange={toggle.onChange}
          />
        )}
      </div>
    </StyledCardHeader>
  );
};
