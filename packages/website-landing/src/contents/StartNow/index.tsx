import { Headline } from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import QrSignup from '../../images/qr_signup.svg';

import { StyledStartNow } from './StyledStartNow';

export const StartNowContent = () => {
  const { t } = useTranslation();

  return (
    <StyledStartNow>
      <Flex
        direction={'column'}
        alignItems={'center'}
        borderRadius={'24px'}
        p={16}
        className={'al-website__blur-box'}
      >
        <Headline
          size={2}
          fontWeight={FONT_WEIGHT.SEMI_BOLD}
          textAlign={'center'}
        >
          {t('signUp.headline')}
        </Headline>
        <Box my={4}>
          <Headline
            size={4}
            fontWeight={FONT_WEIGHT.REGULAR}
            textAlign={'center'}
          >
            {t('signUp.subHeadline')}
          </Headline>
        </Box>
        <img
          className={'al-website__qr-signup'}
          src={QrSignup}
          alt="qr signup"
        />
      </Flex>
    </StyledStartNow>
  );
};
