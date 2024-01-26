import { setI18nextCookie } from '@app/shared/i18n';
import { Button, Headline, Icon, Radio } from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, Grid, useColorMode } from '@chakra-ui/react';
import { navigate } from 'gatsby';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LANDING_URL } from '../../constants';
import { languages } from '../../locales/constants';

import { StyledLanguages } from './StyledLanguages';

export const LanguagesContent = () => {
  const { colorMode } = useColorMode();

  const { t, i18n } = useTranslation();
  const [isChecked, setIsChecked] = useState(i18n.language);

  const changeLanguage = async lng => {
    setIsChecked(lng);
    await i18n.changeLanguage(lng);
    setI18nextCookie(LANDING_URL, lng);
  };

  return (
    <StyledLanguages $colorMode={colorMode} className={'al-website__languages'}>
      <Button
        variant={'link'}
        className={'al-website__close'}
        onClick={() => navigate('/')}
      >
        <Icon>close</Icon>
      </Button>
      <Flex direction={'column'} width={'100%'} alignItems={'center'}>
        <Box display={{ base: 'none', md: 'block' }}>
          <Headline
            size={1}
            fontWeight={FONT_WEIGHT.SEMI_BOLD}
            textAlign={'center'}
          >
            {t('languages.headline')}
          </Headline>
        </Box>
        <Box display={{ base: 'block', md: 'none' }}>
          <Headline
            size={2}
            fontWeight={FONT_WEIGHT.SEMI_BOLD}
            textAlign={'center'}
          >
            {t('languages.headline')}
          </Headline>
        </Box>
        <Flex
          width={'100%'}
          justifyContent={'center'}
          alignItems={'flex-start'}
          className={'al-website__languages__grid'}
          mb={{ base: 0, sm: 16 }}
          pt={16}
        >
          <Grid
            width={'70%'}
            templateRows={{ base: 'repeat(5, 1fr)', md: 'repeat(2, 1fr)' }}
            templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }}
            gap={8}
          >
            {languages.map(({ code, translationKey }) => (
              <Radio
                value={code}
                isChecked={isChecked === code}
                onClick={changeLanguage}
              >
                {t(`languages.${translationKey}`)}
              </Radio>
            ))}
          </Grid>
        </Flex>
      </Flex>
    </StyledLanguages>
  );
};
