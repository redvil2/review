import {
  Accordion,
  AccordionBodyItem,
  AccordionItem,
  AccordionItemHeader,
  AccordionPanel,
  Badge,
  BADGE_VARIANTS,
  Button,
  Card,
  CardHeader,
  Headline,
  Icon,
  PageHeader,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, HStack, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

export const TeamMembers = ({ edit }: { edit?: boolean }) => {
  const { t } = useTranslation();
  const { projectId, teamId } = useParams();
  const navigate = useNavigate();
  const [currentTeamMemberIds, setCurrentTeamMemberIds] = useState<number[]>(
    [],
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [checkMarkToUserId, setCheckmarkToUserId] = useState<number | null>(
    null,
  );
  const toast = useToast();
  const { data: invitationData, refetch: refetchInvites } =
    trpc.invitation.listByTeamId.useQuery({
      teamId: Number(teamId),
    });
  const { data: memberData, refetch: refetchMembers } =
    trpc.membership.listByTeamId.useQuery({
      teamId: Number(teamId),
    });
  const { data: contactData } = trpc.contact.list.useQuery();

  const { data: projectData } = trpc.project.getById.useQuery({
    id: Number(projectId),
  });

  const deleteInviteMutation = trpc.invitation.delete.useMutation({
    onSuccess: async () => {
      await refetchInvites();
    },
    onError: error => {
      toast({
        title: t('error.failedToDeleteInvitation'),
        description: error.message,
        status: 'error',
      });
    },
  });

  const addTeamMemberMutation = trpc.membership.create.useMutation({
    onSuccess: async ({ teamMembership }) => {
      setCheckmarkToUserId(teamMembership.userId);
      setTimeout(async () => {
        await refetchMembers();
        setCheckmarkToUserId(null);
      }, 3000);
    },
    onError: error => {
      toast({
        title: t('error.failedToAddMember'),
        description: error.message,
        status: 'error',
      });
    },
  });

  const deleteTeamMutation = trpc.team.delete.useMutation({
    onSuccess: async () => {
      navigate(`/project/${projectId}/share/teams`);
    },
    onError: error => {
      toast({
        title: t('error.failedToDeleteTeam'),
        description: error.message,
        status: 'error',
      });
    },
  });

  useEffect(() => {
    if (
      !invitationData?.invitations.length &&
      !contactData?.contacts.length &&
      memberData?.teamMemberships &&
      memberData?.teamMemberships.length === 1 &&
      memberData?.teamMemberships[0].role === 'OWNER' &&
      !edit
    ) {
      navigate(`/project/${projectId}/invite/create/${teamId}`);
    }

    if (memberData?.teamMemberships) {
      setCurrentTeamMemberIds(
        memberData?.teamMemberships.map(({ userId }) => userId),
      );
    }
  }, [memberData, contactData, invitationData]);

  const handleDeleteInvite = (id: number) => {
    deleteInviteMutation.mutate({ id });
  };

  const handleAddMember = (userId: number, role: 'EDITOR' | 'VIEWER') => {
    setOpenIndex(null);
    addTeamMemberMutation.mutate({
      teamId: Number(teamId),
      userId,
      role,
      status: 'ACTIVE',
    });
  };

  const handleDeleteTeam = () => {
    deleteTeamMutation.mutate({
      id: Number(teamId),
    });
  };

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

  const filteredContacts = contactData?.contacts.filter(({ userId }) =>
    currentTeamMemberIds.every(memberId => memberId !== userId),
  );

  const translatePosition = p => (p ? t(`onboarding.${p}`) : null);

  const isOwner = (userId: number) => userId === projectData?.project.userId;
  // convert team owner to editor and project owner to owner
  const setRole = (userId: number, role: string) => {
    if (isOwner(userId)) return 'OWNER';
    if (role === 'OWNER') return 'EDITOR';
    return role;
  };

  return (
    <>
      <PageHeader
        btnLabel={edit ? t('system.shareWith') : t('addTeamFlow.teamName')}
        xRoute={edit ? undefined : `/project/${projectId}/share/teams`}
        onBtnClick={() =>
          navigate(
            edit
              ? `/project/${projectId}/share/teams`
              : `/project/${projectId}/teams/add/${teamId}`,
          )
        }
        contextMenu={
          edit
            ? [
                {
                  id: 1,
                  name: t('system.rename'),
                  icon: <Icon>edit</Icon>,
                  onClick: () =>
                    navigate(`/project/${projectId}/teams/add/${teamId}/edit`),
                },
                {
                  id: 2,
                  name: t('system.delete'),
                  icon: <Icon>delete</Icon>,
                  destructive: true,
                  onClick: handleDeleteTeam,
                },
              ]
            : undefined
        }
      />
      <VStack w={'100%'} gap={6} mt={12}>
        <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
          {edit ? t('editTeamPage.editTeam') : t('addTeamFlow.addMembers')}
        </Headline>
        <Button
          className={'self-end'}
          variant={'secondary'}
          leftIcon={<Icon>person_add</Icon>}
          onClick={() =>
            navigate(
              `/project/${projectId}/invite/${edit ? 'edit' : 'add'}/${teamId}`,
            )
          }
        >
          {t('system.inviteUser')}
        </Button>
        <VStack w={'100%'}>
          <Box w={'100%'} mt={2} mb={4}>
            <Accordion>
              <AccordionItem>
                <AccordionItemHeader>
                  {t('addTeamFlow.currentMembers')}{' '}
                  <span className={'al-current-members-count'}>{`(${String(
                    memberData?.teamMemberships.length || 0,
                  )})`}</span>
                </AccordionItemHeader>
                <AccordionPanel>
                  {memberData?.teamMemberships.map(
                    ({ role, userId, id, user: { firstName, lastName } }) => (
                      <AccordionBodyItem
                        key={userId}
                        noPointer={isOwner(userId)}
                        subline={
                          <Badge
                            noDot
                            variant={setBadgeVariant(setRole(userId, role))}
                          >
                            {t(`role.${setRole(userId, role).toLowerCase()}`)}
                          </Badge>
                        }
                        iconRight={role !== 'OWNER' && <Icon>edit</Icon>}
                        onClick={() => {
                          if (!isOwner(userId)) {
                            navigate(
                              `/project/${projectId}/teams/${teamId}/members/${id}/${
                                edit ? 'edit' : 'add'
                              }`,
                            );
                          }
                        }}
                      >
                        {`${firstName} ${lastName}`}
                      </AccordionBodyItem>
                    ),
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
          {invitationData?.invitations
            .filter(invite => invite.status === 'PENDING')
            .map(({ id, recipientEmail, membershipRole }) => (
              <Card
                key={id}
                className={'card-invitee'}
                header={
                  <CardHeader
                    rightIcon={{ name: 'timelapse' }}
                    button={{
                      iconName: 'delete',
                      variant: 'link',
                      onClick: () => handleDeleteInvite(id),
                    }}
                    subtitle={
                      <Badge
                        noDot
                        variant={setBadgeVariant(membershipRole as string)}
                      >
                        {t(`role.${membershipRole?.toLowerCase()}`)}
                      </Badge>
                    }
                  >
                    {recipientEmail}
                  </CardHeader>
                }
              />
            ))}
          {contactData?.contacts.length && filteredContacts?.length && (
            <Paragraph
              className={'suggested-members-title'}
              size={1}
              fontWeight={FONT_WEIGHT.MEDIUM}
              textAlign={'left'}
            >
              {t('addTeamFlow.suggested')}
            </Paragraph>
          )}
          {filteredContacts?.map(
            ({ userId, user: { firstName, lastName, userSettings } }, idx) => (
              <Accordion
                key={userId}
                index={openIndex === idx ? 0 : null}
                onChange={() =>
                  userId !== checkMarkToUserId &&
                  setOpenIndex(openIndex === idx ? null : idx)
                }
              >
                <AccordionItem>
                  {({ isExpanded }) => (
                    <>
                      <AccordionItemHeader
                        className={
                          isExpanded ? 'al-accordion-header_animate-icon' : ''
                        }
                        accordionIcon={
                          checkMarkToUserId === userId ? (
                            <Icon>done</Icon>
                          ) : (
                            <Icon>add</Icon>
                          )
                        }
                        subtitle={translatePosition(userSettings?.position)}
                      >
                        {`${firstName} ${lastName}`}
                      </AccordionItemHeader>
                      <AccordionPanel>
                        <VStack p={4} gap={4} alignItems={'flex-start'}>
                          <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
                            {t('addTeamFlow.selectRole')}
                          </Paragraph>
                          <HStack gap={2}>
                            <Button
                              variant={'secondary'}
                              size={'small'}
                              onClick={() => handleAddMember(userId, 'VIEWER')}
                            >
                              {t('role.viewer')}
                            </Button>
                            <Button
                              variant={'secondary'}
                              size={'small'}
                              onClick={() => handleAddMember(userId, 'EDITOR')}
                            >
                              {t('role.editor')}
                            </Button>
                          </HStack>
                        </VStack>
                      </AccordionPanel>
                    </>
                  )}
                </AccordionItem>
              </Accordion>
            ),
          )}
        </VStack>
        {!edit && (
          <Box mt={2}>
            <Button
              onClick={() => navigate(`/project/${projectId}/share/teams`)}
            >
              {t('system.save')}
            </Button>
          </Box>
        )}
      </VStack>
    </>
  );
};
