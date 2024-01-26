import { Display, Headline, Logo, Subline } from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, useColorMode } from '@chakra-ui/react';
import React from 'react';

import Balmain from '../../images/balmain.png';
import EnterToWin from '../../images/enter-to-win.svg';
import GerryWeber from '../../images/gerryweber.png';
import HeroImage from '../../images/hero_image_light.png';
import Notifications from '../../images/notification_illustration.svg';
import OutdatedPage from '../../images/outdated.svg';
import Rowe from '../../images/rowe.png';
import SearchUrl from '../../images/search.svg';
import ShampooAndPhone from '../../images/shampoo.svg';
import WaterAndPhone from '../../images/water_phone.svg';

import { StyledHomePage } from './StyledHomePage';

export const IndexContent = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <StyledHomePage $colorMode={colorMode}>
      <Box className={'al-website__gradient-wrapper'}>
        <Box className={'al-website__header'} p={4}>
          <Logo />
          <Box></Box>
        </Box>
        <Box
          className={'al-website__hero'}
          position={'relative'}
          height={'100vh'}
        >
          <Box position={'absolute'} right={0} zIndex={0}>
            <img src={HeroImage} alt="hero" />
          </Box>
          <Box position={'relative'} left={0}>
            <Box display={{ base: 'none', md: 'block' }}>
              <Display
                className={'al-website__hero-headline'}
                size={1}
                fontWeight={FONT_WEIGHT.SEMI_BOLD}
              >
                Upgrade your print labels
              </Display>
              <Headline
                className={'al-website__hero-text'}
                size={3}
                fontWeight={FONT_WEIGHT.REGULAR}
              >
                People look at labels 35 times a day. Give your customers an
                easy and personalized way to access your marketing materials -
                without requiring them to type in a website URL.
              </Headline>
            </Box>
            <Box display={{ base: 'block', md: 'none' }}>
              <Headline
                className={'al-website__hero-headline'}
                size={2}
                fontWeight={FONT_WEIGHT.SEMI_BOLD}
              >
                Upgrade your print labels
              </Headline>
              <Headline
                className={'al-website__hero-text'}
                size={4}
                fontWeight={FONT_WEIGHT.REGULAR}
              >
                People look at labels 35 times a day.
              </Headline>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={'al-website__brands'}>
        <Headline size={4} fontWeight={FONT_WEIGHT.MEDIUM}>
          Trusted by Global Consumer Brands
        </Headline>
        <img src={Rowe} alt="rowe" />
        <img src={Balmain} alt="balmain" />
        <img src={GerryWeber} alt="gerryweber" />
      </Box>
      <Box className={'al-website__benefits'}>
        <Headline size={1} fontWeight={FONT_WEIGHT.MEDIUM} textAlign={'center'}>
          Printing URLs on your labels is a way of the past.
        </Headline>
        <Flex direction={{ base: 'column', md: 'row' }}>
          <Box
            className={'al-website__bg-box'}
            px={4}
            py={8}
            borderRadius={'24px'}
            mb={4}
          >
            <Flex
              justifyContent={'center'}
              alignItems={'flex-start'}
              height={'65%'}
              mb={4}
            >
              <img src={SearchUrl} alt="search" />
            </Flex>
            <Box>
              <Subline
                size={1}
                fontWeight={FONT_WEIGHT.MEDIUM}
                textAlign={'center'}
              >
                Urls are hard to type manually, so customers just do their own
                searches on google
              </Subline>
            </Box>
          </Box>
          <Box
            className={'al-website__bg-box'}
            px={4}
            py={8}
            mx={4}
            mb={4}
            borderRadius={'24px'}
          >
            <Flex
              justifyContent={'center'}
              alignItems={'flex-start'}
              mb={4}
              height={'65%'}
            >
              <img src={OutdatedPage} alt="outdated" />
            </Flex>
            <Box>
              <Subline
                size={1}
                fontWeight={FONT_WEIGHT.MEDIUM}
                textAlign={'center'}
              >
                URLs are static, which means they cannot be updated or
                personalized for unique customer experiences.
              </Subline>
            </Box>
          </Box>
          <Box
            className={'al-website__bg-box'}
            px={4}
            py={8}
            mb={4}
            borderRadius={'24px'}
          >
            <Flex
              justifyContent={'center'}
              alignItems={'flex-start'}
              mb={4}
              height={'65%'}
            >
              <img src={Notifications} alt="notification" />
            </Flex>
            <Box>
              <Subline
                size={1}
                fontWeight={FONT_WEIGHT.MEDIUM}
                textAlign={'center'}
              >
                URLs have no internal tracking, which means they can’t tell you
                if anyone is even using them.
              </Subline>
            </Box>
          </Box>
        </Flex>
      </Box>
      <Box className={'al-website__qr-codes'}>
        <Headline size={1} fontWeight={FONT_WEIGHT.MEDIUM} textAlign={'center'}>
          Ditch the URL. <br /> Embrace the QR Code.
        </Headline>
        <Flex
          className={'al-website__bg-gradient'}
          borderRadius={'24px'}
          mb={6}
          py={4}
          pl={4}
        >
          <Box>
            <Headline size={4} fontWeight={FONT_WEIGHT.MEDIUM}>
              Easy to Use
            </Headline>
            <Headline size={1} fontWeight={FONT_WEIGHT.MEDIUM}>
              Send customers to specific web pages using just their phone
              camera.
            </Headline>
            <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
              Make it way easier for your customers to access your marketing
              materials using automatically generated QR codes for each of your
              labels.
            </Headline>
          </Box>
          <img src={WaterAndPhone} />
        </Flex>
        <Flex
          className={'al-website__bg-gradient-reverse'}
          borderRadius={'24px'}
          mb={6}
        >
          <img src={ShampooAndPhone} />
          <Box>
            <Headline size={4} fontWeight={FONT_WEIGHT.MEDIUM}>
              Personalized
            </Headline>
            <Headline size={1} fontWeight={FONT_WEIGHT.MEDIUM}>
              Show different content depending on who scans the QR code.
            </Headline>
            <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
              Make your content more tailored with QR codes that can tell what
              country each scanner is in, what language they speak, and if they
              are a repeat user.
            </Headline>
          </Box>
        </Flex>
        <Flex
          className={'al-website__bg-gradient-reverse'}
          borderRadius={'24px'}
          mb={6}
        >
          <Box>
            <Headline size={4} fontWeight={FONT_WEIGHT.MEDIUM}>
              Trackable
            </Headline>
            <Headline size={1} fontWeight={FONT_WEIGHT.MEDIUM}>
              See exactly how many times a QR code has been scanned.
            </Headline>
            <Headline size={4} fontWeight={FONT_WEIGHT.REGULAR}>
              Get a better understanding of how customers are engaging with your
              content with analytics that logs page loads and button clicks.
            </Headline>
          </Box>
        </Flex>
      </Box>
      <Box>
        <Headline size={1} fontWeight={FONT_WEIGHT.MEDIUM} textAlign={'center'}>
          See ways marketing teams are using QR codes to drive ongoing customer
          engagement.
        </Headline>
        <Flex>
          <Box className={'al-website__bg-box'} borderRadius={'24px'} p={4}>
            <Flex
              justifyContent={'center'}
              alignItems={'flex-start'}
              mb={4}
              height={'65%'}
            >
              <img src={EnterToWin} alt="Enter to win" />
            </Flex>
            <Box>
              <Subline
                size={1}
                fontWeight={FONT_WEIGHT.MEDIUM}
                textAlign={'center'}
              >
                Collect sweepstakes participants
              </Subline>
            </Box>
          </Box>
          <Box className={'al-website__bg-box'} borderRadius={'24px'} p={4}>
            <Flex
              justifyContent={'center'}
              alignItems={'flex-start'}
              mb={4}
              height={'65%'}
            >
              <img src={EnterToWin} alt="Enter to win" />
            </Flex>
            <Box>
              <Subline
                size={1}
                fontWeight={FONT_WEIGHT.MEDIUM}
                textAlign={'center'}
              >
                Collect sweepstakes participants
              </Subline>
            </Box>
          </Box>
          <Box className={'al-website__bg-box'} borderRadius={'24px'} p={4}>
            <Flex
              justifyContent={'center'}
              alignItems={'flex-start'}
              mb={4}
              height={'65%'}
            >
              <img src={EnterToWin} alt="Enter to win" />
            </Flex>
            <Box>
              <Subline
                size={1}
                fontWeight={FONT_WEIGHT.MEDIUM}
                textAlign={'center'}
              >
                Collect sweepstakes participants
              </Subline>
            </Box>
          </Box>
          <Box className={'al-website__bg-box'} borderRadius={'24px'} p={4}>
            <Flex
              justifyContent={'center'}
              alignItems={'flex-start'}
              mb={4}
              height={'65%'}
            >
              <img src={EnterToWin} alt="Enter to win" />
            </Flex>
            <Box>
              <Subline
                size={1}
                fontWeight={FONT_WEIGHT.MEDIUM}
                textAlign={'center'}
              >
                Collect sweepstakes participants
              </Subline>
            </Box>
          </Box>
        </Flex>
      </Box>
    </StyledHomePage>
  );
};
