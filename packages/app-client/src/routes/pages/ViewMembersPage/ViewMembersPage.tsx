import {
  Accordion,
  AccordionBodyItem,
  AccordionItem,
  AccordionItemHeader,
  AccordionPanel,
  Badge,
  BADGE_VARIANTS,
  PageHeader,
  PageHeadline,
  PageWrapper,
} from '@app/shared/ui/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { StyledViewMembersPage } from './StyledViewMembers';

export const ViewMembersPage = () => {
  const { t } = useTranslation();
  const { projectId, teamId } = useParams();
  const { data: projectData } = trpc.project.getById.useQuery({
    id: Number(projectId),
  });
  const { data: memberData } = trpc.membership.listByTeamId.useQuery({
    teamId: Number(teamId),
  });

  const setBadgeVariant = (role: string) => {
    switch (role) {
      case 'VIEWER':
        return BADGE_VARIANTS.SURFACE_VARIANT;
      case 'EDITOR':
        return BADGE_VARIANTS.AQUA;
      case 'OWNER':
        return BADGE_VARIANTS.SUN;
      default:
        return BADGE_VARIANTS.DEFAULT;
    }
  };

  const isOwner = (userId: number) => userId === projectData?.project.userId;
  // convert team owner to editor and project owner to owner
  const setRole = (userId: number, role: string) => {
    if (isOwner(userId)) return 'OWNER';
    if (role === 'OWNER') return 'EDITOR';
    return role;
  };
  return (
    <StyledViewMembersPage>
      <PageWrapper>
        <PageHeader
          btnLabel={t('projectPage.sharedWith')}
          btnRoute={`/project/${projectId}/shared/teams`}
          xRoute={`/project/${projectId}/shared/teams`}
        />
        <PageHeadline>View members</PageHeadline>

        <Accordion defaultIndex={0}>
          <AccordionItem>
            <AccordionItemHeader>
              {t('addTeamFlow.currentMembers')}{' '}
              <span className={'al-current-members-count'}>{`(${String(
                memberData?.teamMemberships.length || 0,
              )})`}</span>
            </AccordionItemHeader>
            <AccordionPanel>
              {memberData?.teamMemberships.map(
                ({ role, userId, user: { firstName, lastName } }) => (
                  <AccordionBodyItem
                    key={userId}
                    noPointer
                    subline={
                      <Badge
                        noDot
                        variant={setBadgeVariant(setRole(userId, role))}
                      >
                        {t(`role.${setRole(userId, role).toLowerCase()}`)}
                      </Badge>
                    }
                  >
                    {`${firstName} ${lastName}`}
                  </AccordionBodyItem>
                ),
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </PageWrapper>
    </StyledViewMembersPage>
  );
};
