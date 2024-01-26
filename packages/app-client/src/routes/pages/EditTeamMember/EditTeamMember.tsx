import { DropdownCard } from '@app/core/web/ui';
import {
  Button,
  DropdownMenuItem,
  Headline,
  Icon,
  PageHeader,
  PageWrapper,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { HStack, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { StyledEditTeamMember } from './editTeamMember.style';

type Role = 'OWNER' | 'MANAGER' | 'EDITOR' | 'VIEWER' | undefined;

const EDIT_MODE = {
  EDIT: 'edit',
  ADD: 'add',
  USER: 'user',
};

export const EditTeamMember = () => {
  const { t } = useTranslation();
  const { projectId, teamId, memberId, mode } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [role, setRole] = React.useState<string>('');
  const trpcUtils = trpc.useContext();
  const { data: teamData } = trpc.team.getById.useQuery({ id: Number(teamId) });
  const { data: teamMemberData } = trpc.membership.getById.useQuery({
    id: Number(memberId),
  });

  const backRoute = () => {
    if (mode === EDIT_MODE.ADD) {
      return `/project/${projectId}/teams/add/${teamId}/members`;
    } else {
      return `/project/${projectId}/teams/${teamId}/edit`;
    }
  };

  const updateMemberMutation = trpc.membership.update.useMutation({
    onSuccess: async () => {
      await trpcUtils.membership.getById.invalidate();
      navigate(backRoute());
    },
    onError: error => {
      toast({
        title: t('error.failedToUpdateRole'),
        description: error.message,
        status: 'error',
      });
    },
  });

  const deleteMembershipMutation = trpc.membership.delete.useMutation({
    onSuccess: async () => {
      navigate(backRoute());
    },
    onError: error => {
      toast({
        title: t('error.failedToDeleteMember'),
        description: error.message,
        status: 'error',
      });
    },
  });

  useEffect(() => {
    if (teamMemberData?.teamMembership && role === '') {
      setRole(teamMemberData?.teamMembership.role);
    }
  });

  const handleRoleChange = (item: DropdownMenuItem<string>) => {
    setRole(item.id as string);
  };

  const handleRemoveMember = () => {
    deleteMembershipMutation.mutate({
      id: Number(memberId),
    });
  };

  const handleSave = () => {
    updateMemberMutation.mutate({
      id: Number(memberId),
      role: role as Role,
    });
  };

  return (
    <StyledEditTeamMember>
      <PageWrapper>
        <PageHeader xRoute={backRoute()} />
        <VStack w={'100%'} gap={4} mt={12}>
          <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
            {`${teamMemberData?.teamMembership.user.firstName} ${teamMemberData?.teamMembership.user.lastName}`}
          </Headline>
          <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
            {t(
              `onboarding.${teamMemberData?.teamMembership.user.userSettings.position}`,
            )}
          </Paragraph>
          <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
            {teamData?.team.name}
          </Paragraph>
        </VStack>
        <VStack w={'100%'} gap={8} mt={8}>
          {role !== '' && (
            <DropdownCard
              label={t('addTeamFlow.updateRole')}
              defaultId={role}
              menuItems={[
                { id: 'VIEWER', name: 'Viewer' },
                { id: 'EDITOR', name: 'Editor' },
              ]}
              onChange={handleRoleChange}
              rightIcon={<Icon className="__right-icon">expand_more</Icon>}
            />
          )}
          <HStack justifyContent={'space-between'} w={'100%'}>
            <Button
              variant={'secondary'}
              onClick={handleRemoveMember}
              leftIcon={<Icon>group_remove</Icon>}
            >
              {t('system.remove')}
            </Button>
            <Button
              isDisabled={role === teamMemberData?.teamMembership.role}
              onClick={handleSave}
            >
              {t('system.save')}
            </Button>
          </HStack>
        </VStack>
      </PageWrapper>
    </StyledEditTeamMember>
  );
};
