import { Button, Display, Headline, Subline } from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CORE_WEB_URL } from '../../constants';
import HeroImageDark from '../../images/hero_image_dark.png';
import HeroImageLight from '../../images/hero_image_light.png';

import { StyledHomePage } from './StyledHomePage';

export const IndexContent = () => {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  return (
    <StyledHomePage $colorMode={colorMode}>
      <Flex
        direction={'column'}
        justifyContent={'center'}
        className={'al-website__hero'}
      >
        <Box
          position={'absolute'}
          right={0}
          zIndex={0}
          top={{ base: '-5rem', md: '2rem' }}
          height={'80vh'}
          maxWidth={'85vw'}
        >
          <img
            src={colorMode === 'light' ? HeroImageLight : HeroImageDark}
            alt="hero"
          />
        </Box>
        <Box
          position={'relative'}
          left={0}
          px={{ base: 8, md: 10, sm: 16 }}
          width={{ base: '100vw', md: '50vw', sm: '70vw' }}
          mt={{ base: '20rem', md: '12%' }}
        >
          <Box display={{ base: 'none', md: 'block' }}>
            <Display
              className={'al-website__hero-headline'}
              size={1}
              fontWeight={FONT_WEIGHT.SEMI_BOLD}
            >
              {t('home.heroHeadline')}
            </Display>
          </Box>
          <Box display={{ base: 'block', md: 'none' }}>
            <Headline
              size={2}
              fontWeight={FONT_WEIGHT.SEMI_BOLD}
              className={'al-website__hero-headline'}
            >
              {t('home.heroHeadline')}
            </Headline>
          </Box>
          <Box display={{ base: 'none', md: 'block' }}>
            <Headline
              className={'al-website__hero-text'}
              size={3}
              fontWeight={FONT_WEIGHT.REGULAR}
            >
              {t('home.heroSubheadline')}
            </Headline>
          </Box>
          <Box display={{ base: 'block', md: 'none' }}>
            <Subline
              size={2}
              fontWeight={FONT_WEIGHT.REGULAR}
              className={'al-website__hero-text'}
            >
              {t('home.heroSubheadline')}
            </Subline>
          </Box>
          <a href={`${CORE_WEB_URL}/signin`} rel="noopener">
            <Button>{t('home.heroCta')}</Button>
          </a>
        </Box>
      </Flex>
    </StyledHomePage>
  );
};
