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
  Icon,
  Loader,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, HStack, VStack, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { ReactComponent as DashedArrow } from '../../../assets/icons/dashed-arrow.svg';

export const ShareWithUser = ({ viewOnly }: { viewOnly?: boolean }) => {
  const { projectId } = useParams();
  const toast = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userIds, setUserIds] = useState<number[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [checkMarkToUserId, setCheckmarkToUserId] = useState<number | null>(
    null,
  );

  const { data: contactsData, isLoading: contactsIsLoading } =
    trpc.contact.list.useQuery();

  const {
    data: inviteData,
    isLoading: invitesIsLoading,
    refetch: refetchInvites,
  } = trpc.invitation.listByProjectId.useQuery({
    projectId: Number(projectId),
  });

  const {
    data: memberData,
    isLoading: membersIsLoading,
    refetch: refetchMembers,
  } = trpc.project.getMembers.useQuery({
    id: Number(projectId),
  });

  const { data: projectData } = trpc.project.getById.useQuery({
    id: Number(projectId),
  });

  const accessGiveMutation = trpc.access.create.useMutation({
    onSuccess: async ({ access: { receivingUserId } }) => {
      setOpenIndex(null);
      setCheckmarkToUserId(receivingUserId as number);
      setTimeout(async () => {
        await refetchMembers();
        setCheckmarkToUserId(null);
      }, 3000);
    },
    onError: error => {
      toast({
        title: t('system.errorGrantingAccess'),
        description: error.message,
        status: 'error',
      });
    },
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

  useEffect(() => {
    if (memberData) {
      const individualUserIds = memberData
        .filter(access => access.receiverType === 'USER')
        .map(({ receivingUserId }) => receivingUserId) as number[];
      if (
        individualUserIds.length === 1 &&
        individualUserIds[0] === projectData?.project.userId
      ) {
        setUserIds([]);
      } else {
        setUserIds(individualUserIds);
      }
    }
  }, [memberData]);

  const filteredContacts = contactsData?.contacts.filter(
    ({ userId }) => !userIds.includes(userId),
  );

  const translatePosition = p => (p ? t(`onboarding.${p}`) : null);

  const filteredMembers =
    memberData?.filter(access => access.receiverType === 'USER') || [];

  const isOwner = userId => userId === projectData?.project.userId;
  const handleGrantAccess = (userId: number, accessType: string) => {
    accessGiveMutation.mutate({
      receivingUserId: userId,
      accessType: accessType === 'VIEWER' ? 'READ' : 'WRITE',
      projectId: Number(projectId),
    });
  };

  const handleDeleteInvite = (id: number) => {
    deleteInviteMutation.mutate({ id });
  };

  const setBadgeVariant = (accessType: string, isOwner: boolean) => {
    if (isOwner) {
      return BADGE_VARIANTS.SUN;
    }
    switch (accessType) {
      case 'READ':
        return BADGE_VARIANTS.SURFACE_VARIANT;
      case 'WRITE':
        return BADGE_VARIANTS.AQUA;
      default:
        return BADGE_VARIANTS.SUN;
    }
  };

  if (contactsIsLoading || invitesIsLoading || membersIsLoading) {
    return (
      <HStack justifyContent={'center'}>
        <Loader />
      </HStack>
    );
  }

  return (
    <VStack w={'100%'} alignItems={'flex-start'}>
      {filteredMembers?.length <= 1 && !inviteData?.invitations.length ? (
        <HStack
          w={'100%'}
          justifyContent={'flex-end'}
          alignItems={'baseline'}
          mt={'-1.5rem'}
          gap={4}
        >
          <Paragraph size={1} fontWeight={FONT_WEIGHT.MEDIUM}>
            {t('shareLabelPage.inviteUser')}
          </Paragraph>
          <DashedArrow />
        </HStack>
      ) : (
        <>
          {userIds?.length >= 1 && (
            <Box w={'100%'} mt={2} mb={2}>
              <Accordion index={viewOnly ? 0 : undefined}>
                <AccordionItem>
                  <AccordionItemHeader>
                    {t('shareLabelPage.currentUsers')}{' '}
                    <span className={'al-current-members-count'}>{`(${String(
                      memberData?.filter(
                        access => access.receiverType === 'USER',
                      ).length || 0,
                    )})`}</span>
                  </AccordionItemHeader>
                  <AccordionPanel>
                    {filteredMembers?.map(
                      ({ accessType, id, receivingUser }) => (
                        <AccordionBodyItem
                          noPointer={isOwner(receivingUser?.id) || viewOnly}
                          key={id}
                          subline={
                            <Badge
                              noDot
                              variant={setBadgeVariant(
                                accessType,
                                isOwner(receivingUser?.id),
                              )}
                            >
                              {t(
                                `role.${
                                  isOwner(receivingUser?.id)
                                    ? 'owner'
                                    : accessType === 'READ'
                                      ? 'viewer'
                                      : 'editor'
                                }`,
                              )}
                            </Badge>
                          }
                          iconRight={
                            !isOwner(receivingUser?.id) && !viewOnly ? (
                              <Icon>edit</Icon>
                            ) : undefined
                          }
                          onClick={() =>
                            !isOwner(receivingUser?.id) &&
                            !viewOnly &&
                            navigate(`/project/${projectId}/access/${id}`)
                          }
                        >
                          {`${receivingUser?.firstName} ${receivingUser?.lastName}`}
                        </AccordionBodyItem>
                      ),
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          )}
          {inviteData?.invitations
            .filter(({ status }) => status === 'PENDING')
            .map(({ id, recipientEmail, accessType }) => (
              <Card
                key={id}
                className={'card-invitee'}
                header={
                  <CardHeader
                    button={{
                      iconName: 'delete',
                      variant: 'link',
                      onClick: () => handleDeleteInvite(id),
                    }}
                    rightIcon={{ name: 'timelapse' }}
                    subtitle={
                      <Badge
                        noDot
                        variant={setBadgeVariant(accessType as string, false)}
                      >
                        {t(
                          `role.${accessType === 'READ' ? 'viewer' : 'editor'}`,
                        )}
                      </Badge>
                    }
                  >
                    {recipientEmail}
                  </CardHeader>
                }
              />
            ))}
        </>
      )}
      {filteredContacts?.length && !viewOnly && (
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
        filteredContacts?.map(
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
                            onClick={() => handleGrantAccess(userId, 'VIEWER')}
                          >
                            {t('role.viewer')}
                          </Button>
                          <Button
                            variant={'secondary'}
                            size={'small'}
                            onClick={() => handleGrantAccess(userId, 'EDITOR')}
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
  );
};
