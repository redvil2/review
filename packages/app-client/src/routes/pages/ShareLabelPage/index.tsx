import {
  Icon,
  PageWrapper,
  PageHeader,
  Headline,
  TabMenu,
  TabList,
  Tab,
  Button,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { HStack, VStack } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

import { StyledShareLabelPage } from './StyledSharePage.style';

export const ShareLabelPage = () => {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number>(0);

  const { data: projectData } = trpc.project.getById.useQuery({
    id: Number(projectId),
  });

  useEffect(() => {
    if (location.pathname.includes('teams')) {
      setOpenIndex(1);
    } else {
      setOpenIndex(0);
    }
  }, [location.pathname]);

  const handleAdd = () => {
    if (location.pathname.includes('teams')) {
      navigate(`/project/${projectId}/teams/add`);
    } else {
      navigate(`/project/${projectId}/invite/share`);
    }
  };

  useSequentialFadeIn(containerRef);

  return (
    <StyledShareLabelPage>
      <PageWrapper ref={containerRef}>
        <PageHeader
          btnLabel={projectData?.project.title}
          btnRoute={`/project/${projectId}`}
          xRoute={`/project/${projectId}`}
        />
        <VStack spacing={8} width="100%" paddingTop={8}>
          <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
            {t('system.shareWith')}
          </Headline>
          <HStack justifyContent={'space-between'} w={'100%'}>
            <TabMenu index={openIndex} onChange={idx => setOpenIndex(idx)}>
              <TabList>
                <Tab
                  iconLeft={<Icon>person</Icon>}
                  onClick={() => navigate(`/project/${projectId}/share`)}
                >
                  {t('system.user')}
                </Tab>
                <Tab
                  iconLeft={<Icon>group</Icon>}
                  onClick={() => navigate(`/project/${projectId}/share/teams`)}
                >
                  {t('system.team')}
                </Tab>
              </TabList>
            </TabMenu>
            <Button leftIcon={<Icon>add</Icon>} onClick={handleAdd} />
          </HStack>
          <Outlet />
        </VStack>
      </PageWrapper>
    </StyledShareLabelPage>
  );
};
