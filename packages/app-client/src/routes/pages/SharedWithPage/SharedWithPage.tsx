import {
  Icon,
  PageHeader,
  PageHeadline,
  PageWrapper,
  Tab,
  TabList,
  TabMenu,
} from '@app/shared/ui/components';
import { HStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { StyledSharedWithPage } from './StyledSharedWithPage';

export const SharedWithPage = () => {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const navigate = useNavigate();
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

  return (
    <StyledSharedWithPage>
      <PageWrapper>
        <PageHeader
          btnLabel={projectData?.project.title}
          btnRoute={`/project/${projectId}`}
        />
        <PageHeadline>{t('projectPage.sharedWith')}</PageHeadline>
        <HStack justifyContent={'space-between'} w={'100%'} mb={4}>
          <TabMenu index={openIndex} onChange={idx => setOpenIndex(idx)}>
            <TabList>
              <Tab
                iconLeft={<Icon>person</Icon>}
                onClick={() => navigate(`/project/${projectId}/shared`)}
              >
                {t('system.user')}
              </Tab>
              <Tab
                iconLeft={<Icon>group</Icon>}
                onClick={() => navigate(`/project/${projectId}/shared/teams`)}
              >
                {t('system.team')}
              </Tab>
            </TabList>
          </TabMenu>
        </HStack>
        <Outlet />
      </PageWrapper>
    </StyledSharedWithPage>
  );
};
