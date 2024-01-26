import {
  Button,
  Card,
  CardInput,
  Headline,
  Loader,
  PageHeader,
} from '@app/shared/ui/components';
import { FONT_WEIGHT, switchColor } from '@app/shared/ui/theme';
import { HStack, useColorMode, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

export const TeamName = () => {
  const { t } = useTranslation();
  const { projectId, teamId, mode } = useParams();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [teamName, setTeamName] = useState<string>('');
  const { data: teamData } = trpc.team.getById.useQuery(
    {
      id: Number(teamId),
    },
    { enabled: teamId !== undefined },
  );

  const backRoute = (): string => {
    if (mode === 'edit') {
      return `/project/${projectId}/teams/${teamId}/edit`;
    } else {
      return `/project/${projectId}/share/teams`;
    }
  };

  const addTeamToProjectMutation = trpc.access.create.useMutation({
    onSuccess: async ({ access: { receivingTeamId } }) => {
      navigate(`/project/${projectId}/teams/add/${receivingTeamId}/members`);
    },
    onError: () => {
      toast({ title: t('error.failedToGrantAccess'), status: 'error' });
    },
  });

  const createTeamMutation = trpc.team.create.useMutation({
    onError: error => {
      toast({
        title: t('error.failedToCreateTeam'),
        description: error.message,
        status: 'error',
      });
    },
    onSuccess: ({ team }) => {
      addTeamToProjectMutation.mutate({
        accessType: 'WRITE',
        projectId: Number(projectId),
        receivingTeamId: team.id,
      });
    },
  });

  const updateTeamMutation = trpc.team.update.useMutation({
    onError: error => {
      toast({
        title: t('error.failedToUpdateTeam'),
        description: error.message,
        status: 'error',
      });
    },
    onSuccess: () => {
      navigate(backRoute() as string);
    },
  });

  useEffect(() => {
    if (teamData?.team.name) {
      setTeamName(teamData?.team.name);
    }
  }, [teamData]);

  const handleNext = () => {
    if (teamId && teamData?.team.name === teamName) {
      navigate(`/project/${projectId}/teams/add/${teamId}/members`);
    } else if (teamId) {
      updateTeamMutation.mutate({
        id: Number(teamId),
        name: teamName,
        type: 'B2B',
      });
    } else {
      createTeamMutation.mutate({
        name: teamName,
        type: 'B2B',
      });
    }
  };

  const handleSave = () => {
    updateTeamMutation.mutate({
      id: Number(teamId),
      name: teamName,
      type: 'B2B',
    });
  };
  return (
    <>
      <PageHeader
        btnLabel={mode === 'edit' ? undefined : t('system.shareWith')}
        btnRoute={
          mode === 'edit' ? undefined : `/project/${projectId}/share/teams`
        }
        xRoute={backRoute()}
      />
      <VStack w={'100%'} gap={8} mt={12}>
        <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
          {mode === 'edit'
            ? t('editTeamPage.renameTeam')
            : t('addTeamFlow.teamName')}
        </Headline>
        <Card
          input={
            <CardInput
              input={{
                placeholder: t('addTeamFlow.teamName'),
                inputValue: teamName,
                onChange: e => setTeamName(e.target.value),
              }}
            />
          }
        />
        {mode === 'edit' ? (
          <HStack justifyContent={'space-between'} w={'100%'}>
            <Button
              variant={'secondary'}
              onClick={() => navigate(backRoute() as string)}
            >
              {t('system.cancel')}
            </Button>
            <Button onClick={handleSave}>{t('system.save')}</Button>
          </HStack>
        ) : (
          <Button isDisabled={!teamName} onClick={handleNext}>
            {createTeamMutation.isLoading ||
            addTeamToProjectMutation.isLoading ? (
              <Loader
                size={'1.5rem'}
                color={switchColor(colorMode).onPrimary}
              />
            ) : (
              t('system.next')
            )}
          </Button>
        )}
      </VStack>
    </>
  );
};
