import {
  Button,
  ContextMenu,
  Icon,
  Logo,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex } from '@chakra-ui/react';
import { navigate, Link } from 'gatsby';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CORE_WEB_URL, APP_REGION } from '../constants';
import CitiesImage from '../images/Berlin-shanghai-sanfrancisco.svg';

import { StyledHeaderFooter } from './StyledHeaderFooter';

const getNormalizedLanguageCode = (code: string) => {
  return code.split('-')[0].toLowerCase();
};

export const HeaderFooter = ({ children, withoutMenu = false }) => {
  const { t, i18n } = useTranslation();
  return (
    <StyledHeaderFooter>
      <Box
        className={'al-website__header'}
        p={4}
        position={'relative'}
        zIndex={1}
      >
        <Link
          className={'al-logo'}
          to={'/'}
          activeClassName="active"
          rel="noopener"
        >
          <Logo region={APP_REGION} />
        </Link>
        {!withoutMenu && (
          <>
            <Box
              className={'al-website__menu'}
              display={{ base: 'none', md: 'block' }}
            >
              {/*<Button variant={'link'} className={'al-link active'}>
                {t('header.whyQrCodes')}
              </Button>*/}
              {/*<Link to={'/whatsnew'} activeClassName="active" rel="noopener">
                <Button variant={'link'} className={'al-link'}>
                  {t('header.whatsNew')}
                </Button>
              </Link>*/}
              <a href={`${CORE_WEB_URL}/signin`} rel="noopener">
                <Button variant={'secondary'}>{t('header.login')}</Button>
              </a>
              <a href={`${CORE_WEB_URL}/signin`} rel="noopener">
                <Button variant={'primary'}>{t('header.signup')}</Button>
              </a>
            </Box>
            <Box
              className={'al-website__menu-mobile'}
              display={{ base: 'block', md: 'none' }}
            >
              <ContextMenu
                menuButton={<Icon>menu</Icon>}
                contextMenuItems={[
                  /*{
                    id: 'why-qr-codes',
                    name: t('header.whyQrCodes'),
                  },
                  {
                    id: 'whats-new',
                    name: t('header.whatsNew'),
                  },*/
                  {
                    id: 'login',
                    onClick: () => navigate(`${CORE_WEB_URL}/signin`),
                    button: (
                      <div className={'fake-button secondary'}>
                        {t('header.login')}
                      </div>
                    ),
                  },
                  {
                    id: 'sign-up',
                    onClick: () => navigate(`${CORE_WEB_URL}/signin`),
                    button: (
                      <div className={'fake-button primary'}>
                        {t('header.signup')}
                      </div>
                    ),
                  },
                ]}
              />
            </Box>
          </>
        )}
      </Box>
      {children}
      <Flex
        px={{ base: 8, md: 10, sm: 16 }}
        pt={4}
        pb={2}
        mt={{ base: 16, md: 0 }}
        justifyContent={'space-between'}
        alignItems={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        position={'relative'}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          alignItems={{ md: 'center' }}
        >
          <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
            {t('footer.madeIn')} <br />
            {APP_REGION === 'china' && <span>浙ICP备15022517号-2</span>}
          </Paragraph>
          <Box alignSelf={{ base: 'flex-start' }}>
            <img src={CitiesImage} alt="cities" />
          </Box>
        </Flex>
        <Box
          className={'al-website__footer-menu'}
          alignSelf={{ base: 'flex-end', md: 'center' }}
          mt={{ base: 4, md: 0 }}
        >
          <Button variant={'link'} onClick={() => navigate('/imprint')}>
            {t('footer.imprint')}
          </Button>
          <Button variant={'link'} onClick={() => navigate('/languages')}>
            <Icon>language</Icon>
            <span>
              {t(`languages.${getNormalizedLanguageCode(i18n.language)}`)}
            </span>
          </Button>
        </Box>
      </Flex>
    </StyledHeaderFooter>
  );
};
