import {
  Headline,
  PageHeader,
  PageWrapper,
  Tab,
  TabList,
  TabMenu,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Flex, useColorMode } from '@chakra-ui/react';
import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

import { StyledSettings } from './StyledSettings';

export const SettingsPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <StyledSettings $colorMode={colorMode}>
      <PageWrapper>
        <PageHeader btnRoute={'/labels'} btnLabel={t('system.allLabels')} />
        <Flex ref={containerRef} direction="column" alignItems="center">
          <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
            {t('system.settings')}
          </Headline>
          <TabMenu defaultIndex={location.pathname.includes('domains') ? 1 : 0}>
            <TabList>
              <Tab onClick={() => navigate('/settings')}>
                {t('system.account')}
              </Tab>
              <Tab onClick={() => navigate('/settings/domains')}>
                {t('system.domains')}
              </Tab>
            </TabList>
          </TabMenu>
          <Outlet />
        </Flex>
      </PageWrapper>
    </StyledSettings>
  );
};
