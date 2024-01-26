import {
  Headline,
  PageHeader,
  PageWrapper,
  TabMenu,
  TabList,
  Tab,
  Icon,
} from '@app/shared/ui/components';
import { FONT_WEIGHT, useTheme } from '@app/shared/ui/theme';
import { Flex, HStack, useColorMode } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

import { StyledAnalytics } from './StyledAnalytics';

export const Analytics = () => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const { t } = useTranslation();
  const { projectId, orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: projectData } = trpc.project.getById.useQuery({
    id: Number(projectId),
  });

  const { data: orderData } = trpc.order.getById.useQuery({
    id: Number(orderId),
  });

  let defaultIndex = 0;
  if (location.pathname.includes('protect')) defaultIndex = 1;
  else if (location.pathname.includes('track')) defaultIndex = 2;

  useSequentialFadeIn(containerRef);

  return (
    <StyledAnalytics $colorMode={colorMode} $theme={theme}>
      <PageWrapper>
        <Flex
          ref={containerRef}
          direction={'column'}
          minHeight={'calc(100% - 1rem)'}
          width={'100%'}
        >
          <PageHeader
            btnLabel={projectData?.project?.title}
            btnRoute={`/project/${projectId}`}
          />
          <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
            {orderId &&
              t('analytics.headlineOrder', {
                num: orderData?.order.orderLabel.toString(),
              })}{' '}
          </Headline>
          <HStack className={'al-tab-buttons'}>
            <TabMenu defaultIndex={defaultIndex}>
              <TabList>
                <Tab
                  iconLeft={<Icon>bar_chart</Icon>}
                  onClick={() =>
                    navigate(`/project/${projectId}/order/${orderId}/analytics`)
                  }
                >
                  Engage
                </Tab>
                <Tab
                  iconLeft={<Icon>verified_user</Icon>}
                  onClick={() =>
                    navigate(
                      `/project/${projectId}/order/${orderId}/analytics/protect`,
                    )
                  }
                >
                  Protect
                </Tab>
                <Tab
                  iconLeft={<Icon>conversion_path</Icon>}
                  onClick={() =>
                    navigate(
                      `/project/${projectId}/order/${orderId}/analytics/track`,
                    )
                  }
                >
                  Track
                </Tab>
              </TabList>
            </TabMenu>
          </HStack>
          <Outlet />
        </Flex>
      </PageWrapper>
    </StyledAnalytics>
  );
};
