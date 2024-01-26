import {
  Display,
  Headline,
  Paragraph,
  Subline,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, VStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import AlertImage from '../../images/alerts.svg';
import CoinImage from '../../images/coins.svg';
import HeroImage from '../../images/hero_whatsnew.svg';
import ProtectImage from '../../images/protect.svg';
import PuzzleImage from '../../images/puzzle.svg';

import { StyledWhatsNew } from './StyledWhatsNew';

export const WhatsNewContent = () => {
  const { t } = useTranslation();
  return (
    <StyledWhatsNew>
      <VStack gap={4} mb={8}>
        <Display
          size={1}
          fontWeight={FONT_WEIGHT.SEMI_BOLD}
          textAlign={'center'}
        >
          {t('whatsNew.whatsNew')}
        </Display>
        <Headline
          size={2}
          fontWeight={FONT_WEIGHT.REGULAR}
          textAlign={'center'}
        >
          {t('whatsNew.headline')}
        </Headline>
      </VStack>
      <VStack alignItems={'flex-start'} gap={4} mb={8}>
        <img src={HeroImage} alt={'Hero'} />
        <Paragraph
          className={'al-website-date'}
          size={1}
          fontWeight={FONT_WEIGHT.SEMI_BOLD}
        >
          {t('whatsNew.heroDate')}
        </Paragraph>
      </VStack>
      <VStack alignItems={'flex-start'} gap={4} mb={8}>
        <Headline size={2} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
          {t('whatsNew.title1')}
        </Headline>
        <Subline size={1} fontWeight={FONT_WEIGHT.BOLD}>
          {t('whatsNew.subtitle1')}
        </Subline>
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={'space-between'}
          gap={{ base: 0, md: 6 }}
        >
          <Box w={{ base: '100%', md: '50%' }}>
            <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
              {t('whatsNew.description1')}
            </Headline>
          </Box>
          <Box w={{ base: '100%', md: '50%' }}>
            <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
              <ul>
                <li>{t('whatsNew.list1item1')}</li>
                <li>{t('whatsNew.list1item2')}</li>
                <li>{t('whatsNew.list1item3')}</li>
              </ul>
            </Headline>
          </Box>
        </Flex>
      </VStack>
      <Flex flexDirection={{ base: 'column', md: 'row' }} gap={8} mb={8}>
        <VStack
          w={{ base: '100%', md: '50%' }}
          alignItems={'flex-start'}
          gap={4}
        >
          <VStack gap={4} mb={2} alignItems={'flex-start'}>
            <img src={AlertImage} alt={'alert'} />
            <Paragraph
              className={'al-website-date'}
              size={1}
              fontWeight={FONT_WEIGHT.SEMI_BOLD}
            >
              {t('whatsNew.date2')}
            </Paragraph>
          </VStack>
          <Headline size={2} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
            {t('whatsNew.title2')}
          </Headline>
          <Subline size={1} fontWeight={FONT_WEIGHT.BOLD}>
            {t('whatsNew.subtitle2')}
          </Subline>
          <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
            {t('whatsNew.description2')}
          </Headline>
          <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
            <ul>
              <li>{t('whatsNew.list2item1')}</li>
              <li>{t('whatsNew.list2item2')}</li>
              <li>{t('whatsNew.list2item3')}</li>
            </ul>
          </Headline>
        </VStack>
        <VStack
          w={{ base: '100%', md: '50%' }}
          alignItems={'flex-start'}
          gap={4}
        >
          <VStack gap={4} mb={2} alignItems={'flex-start'}>
            <img src={CoinImage} alt={'coin'} />
            <Paragraph
              className={'al-website-date'}
              size={1}
              fontWeight={FONT_WEIGHT.SEMI_BOLD}
            >
              {t('whatsNew.date3')}
            </Paragraph>
          </VStack>
          <Headline size={2} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
            {t('whatsNew.title3')}
          </Headline>
          <Subline size={1} fontWeight={FONT_WEIGHT.BOLD}>
            {t('whatsNew.subtitle3')}
          </Subline>
          <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
            {t('whatsNew.description3')}
          </Headline>
          <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
            <ul>
              <li>{t('whatsNew.list3item1')}</li>
              <li>{t('whatsNew.list3item2')}</li>
              <li>{t('whatsNew.list3item3')}</li>
            </ul>
          </Headline>
        </VStack>
      </Flex>
      <Flex flexDirection={{ base: 'column', md: 'row' }} gap={8} mb={8}>
        <VStack
          w={{ base: '100%', md: '50%' }}
          alignItems={'flex-start'}
          gap={4}
        >
          <VStack gap={4} mb={2} alignItems={'flex-start'}>
            <img src={PuzzleImage} alt={'puzzle'} />
            <Paragraph
              className={'al-website-date'}
              size={1}
              fontWeight={FONT_WEIGHT.SEMI_BOLD}
            >
              {t('whatsNew.date4')}
            </Paragraph>
          </VStack>
          <Headline size={2} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
            {t('whatsNew.title4')}
          </Headline>
          <Subline size={1} fontWeight={FONT_WEIGHT.BOLD}>
            {t('whatsNew.subtitle4')}
          </Subline>
          <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
            {t('whatsNew.description4')}
          </Headline>
          <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
            <ul>
              <li>{t('whatsNew.list4item1')}</li>
              <li>{t('whatsNew.list4item2')}</li>
              <li>{t('whatsNew.list4item3')}</li>
            </ul>
          </Headline>
        </VStack>
        <VStack
          w={{ base: '100%', md: '50%' }}
          alignItems={'flex-start'}
          gap={4}
        >
          <VStack gap={4} mb={2} alignItems={'flex-start'}>
            <img src={ProtectImage} alt={'protect'} />
            <Paragraph
              className={'al-website-date'}
              size={1}
              fontWeight={FONT_WEIGHT.SEMI_BOLD}
            >
              APRIL 27, 2023
            </Paragraph>
          </VStack>
          <Headline size={2} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
            Protect Torn Labels + 4 Bug Fixes
          </Headline>
          <Subline size={1} fontWeight={FONT_WEIGHT.BOLD}>
            1 Feature · 4 Bug Fixes
          </Subline>
          <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
            In April, we launched our new protection feature, that secures your
            products and labels even if they are tampered with or damaged:
          </Headline>
          <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
            <ul>
              <li>Incorporate invisible security dots into your labels.</li>
              <li>Protect products when labels are damaged</li>
              <li>Enjoy 4 bug fixes.</li>
            </ul>
          </Headline>
        </VStack>
      </Flex>
    </StyledWhatsNew>
  );
};
