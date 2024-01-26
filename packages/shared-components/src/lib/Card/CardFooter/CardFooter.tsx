import { Flex } from '@chakra-ui/react';
import React from 'react';

import { Button } from '../../Button/Button';
import { Icon } from '../../Icon/Icon';

import { StyledCardFooter } from './cardFooter.style';
import { CardFooterPropTypes } from './cardFooter.types';

export const CardFooter: React.FC<CardFooterPropTypes> = ({
  children,
  btnLeft,
  btnRight,
  actions,
}) => {
  return (
    <StyledCardFooter
      className={'al-card-footer'}
      direction={'column'}
      p={'1rem'}
    >
      {actions && (
        <div className={'al-card-footer__action-wrapper'}>{actions}</div>
      )}
      <Flex
        justifyContent={children ? 'space-between' : 'flex-end'}
        alignItems={'center'}
      >
        {children && children}
        <div className={'al-card-footer__button-wrapper'}>
          {btnLeft && (
            <Button
              size={'small'}
              className={'al-card-footer__button-primary'}
              variant={btnLeft.variant && btnLeft.variant}
              leftIcon={btnLeft.icon ? <Icon>{btnLeft.icon}</Icon> : undefined}
              onClick={btnLeft.onClick}
            >
              {btnLeft.label}
            </Button>
          )}
          {btnRight && (
            <Button
              size={'small'}
              className={'al-card-footer__button-link'}
              variant={btnRight.variant && btnRight.variant}
              leftIcon={
                btnRight.icon ? <Icon>{btnRight.icon}</Icon> : undefined
              }
              onClick={btnRight.onClick}
            >
              {btnRight.label}
            </Button>
          )}
        </div>
      </Flex>
    </StyledCardFooter>
  );
};
