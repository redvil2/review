import { Icon, Loader, Paragraph } from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, HStack, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { ReactComponent as DashedArrow } from '../../../assets/icons/dashed-arrow.svg';

import { TeamCard } from './TeamCard';

export const ShareWithTeam = ({ viewOnly }: { viewOnly?: boolean }) => {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { data: teamData, isLoading: teamsIsLoading } =
    trpc.team.list.useQuery();
  const {
    data: accessData,
    isLoading: accessIsLoading,
    refetch: refetchAccess,
  } = trpc.access.getByProjectId.useQuery({
    projectId: Number(projectId),
  });
  const [teamAccessIds, setTeamAccessIds] = useState<number[]>([]);

  const addTeamToProjectMutation = trpc.access.create.useMutation({
    onSuccess: async () => {
      await refetchAccess();
    },
    onError: () => {
      toast({ title: t('error.failedToGrantAccess'), status: 'error' });
    },
  });

  const removeTeamFromProjectMutation = trpc.access.delete.useMutation({
    onSuccess: async () => {
      await refetchAccess();
    },
    onError: error => {
      toast({
        title: t('error.failedToRevokeAccess'),
        description: error.message,
        status: 'error',
      });
    },
  });

  useEffect(() => {
    setTeamAccessIds([]);
    if (accessData?.considerationFactors?.teamAccesses) {
      setTeamAccessIds(
        accessData?.considerationFactors?.teamAccesses.map(
          teamAccess => teamAccess.receivingTeamId as number,
        ),
      );
    }
  }, [accessData?.considerationFactors.teamAccesses]);

  const handleRemoveTeamFromProject = (id: number) => {
    removeTeamFromProjectMutation.mutate({
      id,
    });
  };
  const handleAddTeamToProject = (id: number) => {
    addTeamToProjectMutation.mutate({
      accessType: 'WRITE',
      projectId: Number(projectId),
      receivingTeamId: id,
    });
  };

  const filteredTeams =
    teamData?.teams.filter(team =>
      teamAccessIds.every(accessId => accessId !== team.id),
    ) || [];

  if (teamsIsLoading || accessIsLoading) {
    return (
      <HStack justifyContent={'center'}>
        <Loader />
      </HStack>
    );
  }

  return (
    <VStack w={'100%'} alignItems={'flex-start'}>
      {!teamData?.teams.length &&
      !accessData?.considerationFactors?.teamAccesses.length ? (
        <HStack
          w={'100%'}
          justifyContent={'flex-end'}
          alignItems={'baseline'}
          mt={'-1.5rem'}
          gap={4}
        >
          <Paragraph size={1} fontWeight={FONT_WEIGHT.MEDIUM}>
            {t('addTeamFlow.createTeam')}
          </Paragraph>
          <DashedArrow />
        </HStack>
      ) : (
        <>
          {accessData?.considerationFactors?.teamAccesses.map(teamAccess => (
            <TeamCard
              key={teamAccess.receivingTeamId}
              onClick={() =>
                viewOnly &&
                navigate(
                  `/project/${projectId}/shared/teams/${teamAccess.receivingTeamId}/members`,
                )
              }
              team={teamData?.teams.find(
                team => team.id === teamAccess.receivingTeamId,
              )}
              contextMenuVariant={'alignLeft'}
              contextMenuItems={
                viewOnly
                  ? undefined
                  : [
                      {
                        id: 1,
                        name: t('system.edit'),
                        icon: <Icon>edit</Icon>,
                        onClick: () =>
                          navigate(
                            `/project/${projectId}/teams/${teamAccess.receivingTeamId}/edit`,
                          ),
                      },
                      {
                        id: 2,
                        name: t('system.remove'),
                        icon: <Icon>group_remove</Icon>,
                        onClick: () => {
                          handleRemoveTeamFromProject(teamAccess.id as number);
                        },
                      },
                    ]
              }
            />
          ))}
        </>
      )}
      {filteredTeams.length && !viewOnly && (
        <Box w={'100%'} mt={6}>
          <Paragraph
            className={'suggested-members-title'}
            size={1}
            fontWeight={FONT_WEIGHT.MEDIUM}
            textAlign={'left'}
          >
            {t('addTeamFlow.suggested')}
          </Paragraph>
        </Box>
      )}
      {!viewOnly &&
        filteredTeams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            onClick={() => handleAddTeamToProject(team.id)}
            rightIcon={{
              name: 'add',
            }}
          />
        ))}
    </VStack>
  );
};
