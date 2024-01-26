import { Headline, PageHeader, PageWrapper } from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Flex, useColorMode } from '@chakra-ui/react';
import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { LANDING_URL } from '../../../constants';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

import { StyledSignupLogin } from './StyledSignupLogin';

export const SignupLoginPage: FC = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (pathname === '/signin') {
      window.location.href = LANDING_URL;
    } else if (['/signin/number', '/signin/wechat'].includes(pathname)) {
      navigate('/signin');
    } else if (pathname === '/signin/number/confirm') {
      navigate('/signin/number');
    }
  };
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <StyledSignupLogin className={'signup-login'} $colorMode={colorMode}>
      <PageWrapper ref={containerRef}>
        <PageHeader
          btnLabel={t(pathname === '/signin' ? 'system.goHome' : 'system.back')}
          onBtnClick={handleBack}
        />

        <Flex align="center" direction="column" gap="14" mt="12">
          <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
            {t('signin.signUpOrLogIn')}
          </Headline>
          <Outlet />
        </Flex>
      </PageWrapper>
    </StyledSignupLogin>
  );
};
