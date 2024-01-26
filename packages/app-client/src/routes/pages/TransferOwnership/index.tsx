import {
  Button,
  Card,
  CardHeader,
  Headline,
  Icon,
  Loader,
  Modal,
  PageHeader,
  PageWrapper,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, HStack, Spacer, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { StyledTransferOwnership } from './StyledTransferOwnership';

export const TransferOwnershipPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const [showModalForUser, setShowModalForUser] = useState<null | {
    name: string;
    id: number;
  }>(null);
  const [showWarnModal, setShowWarnModal] = useState(false);
  const {
    data: projectData,
    isLoading: projectLoading,
    isError: projectIsError,
    error: projectError,
  } = trpc.project.getById.useQuery({
    id: Number(projectId),
  });
  const { data: contactData } = trpc.contact.list.useQuery();
  const { data: inviteData, refetch: refetchInvitations } =
    trpc.invitation.listOwn.useQuery();

  const transferOwnership = trpc.project.transferOwnership.useMutation();

  const handleTransfer = () => {
    transferOwnership.mutate({
      projectId: Number(projectId),
      targetUserId: Number(showModalForUser?.id),
    });
  };

  const hasList =
    Number(contactData?.contacts.length || 0) +
      Number(inviteData?.invitations.length || 0) >
    0;

  useEffect(() => {
    if (projectIsError && projectError) {
      toast({
        title: t('error.failedToFetchLabel'),
        description: projectError.message,
        status: 'error',
      });
    }
  }, [projectIsError, projectError, t, toast]);

  const invitationDeleteMutation = trpc.invitation.delete.useMutation({
    onSuccess: () => {
      setTimeout(() => refetchInvitations(), 250);
    },
    onError: error =>
      toast({
        title: t('system.failedToDeletePendingEmailAddress'),
        status: 'error',
        description: error.message,
      }),
  });

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const deleteEmail = (e: React.MouseEvent, id: number) => {
    setLoadingIndex(id);
    e.stopPropagation();
    invitationDeleteMutation.mutate({ id: id });
  };
  return (
    <StyledTransferOwnership>
      <PageWrapper>
        <PageHeader
          btnLabel={projectData?.project.title}
          btnRoute={`/project/${projectId}`}
          xRoute={`/project/${projectId}`}
        />
        {projectLoading ? (
          <HStack justifyContent={'center'} pt={10}>
            <Loader />
          </HStack>
        ) : (
          <VStack mt={10} gap={10}>
            <Headline
              size={3}
              fontWeight={FONT_WEIGHT.SEMI_BOLD}
              textAlign={'center'}
            >
              <div>{t('transferOwnershipPage.transferOwnershipFor')}</div>
              <div>{projectData?.project.title}</div>
            </Headline>
            <VStack
              spacing={4}
              w={'100%'}
              alignItems={hasList ? 'flex-end' : 'center'}
            >
              <Button
                variant={hasList ? 'secondary' : 'primary'}
                leftIcon={<Icon>person_add</Icon>}
                onClick={() =>
                  navigate(`/project/${projectId}/invite/transfer`)
                }
              >
                {t('system.inviteUser')}
              </Button>
              {inviteData?.invitations
                .filter(
                  item => item.status === 'PENDING' && !!item.recipientEmail,
                )
                .map(({ id, recipientEmail }) => (
                  <Card
                    onClick={() => setShowWarnModal(true)}
                    key={id}
                    className={'card-invitee'}
                    header={
                      <CardHeader>
                        <HStack width="full">
                          <Box>{recipientEmail}</Box>
                          <Spacer />
                          {loadingIndex === id ? (
                            <Loader size="6" />
                          ) : (
                            <>
                              <Icon className="primary_color">timelapse</Icon>
                              <Icon
                                onClick={e => {
                                  deleteEmail(e, id);
                                }}
                                className="primary_color"
                              >
                                delete
                              </Icon>
                            </>
                          )}
                        </HStack>
                      </CardHeader>
                    }
                  />
                ))}
              {contactData?.contacts.map(({ user }) => (
                <Card
                  key={user.id}
                  onClick={() =>
                    setShowModalForUser({
                      name: `${user?.firstName} ${user?.lastName}`,
                      id: user?.id as number,
                    })
                  }
                  header={
                    <CardHeader>{`${user?.firstName} ${user?.lastName}`}</CardHeader>
                  }
                />
              ))}
            </VStack>
          </VStack>
        )}
      </PageWrapper>
      <Modal
        title={t('transferOwnershipPage.cannotTransferNote')}
        isOpen={showWarnModal}
        onClose={() => setShowWarnModal(false)}
      >
        <HStack w={'100%'} justifyContent={'center'}>
          <Button onClick={() => setShowWarnModal(false)}>
            {t('system.okay')}
          </Button>
        </HStack>
      </Modal>
      <Modal
        title={t('transferOwnershipPage.transferOwnershipTo', {
          name: showModalForUser?.name,
          newline: '\n',
        })}
        isOpen={!!showModalForUser}
        onClose={() => setShowModalForUser(null)}
      >
        <HStack gap={2} justifyContent={'center'}>
          {transferOwnership.isLoading ? (
            <Loader />
          ) : (
            <>
              <Button
                onClick={() => setShowModalForUser(null)}
                variant={'secondary'}
              >
                {t('system.cancel')}
              </Button>
              <Button onClick={handleTransfer}>
                {t('transferOwnershipPage.confirm')}
              </Button>
            </>
          )}
        </HStack>
      </Modal>
    </StyledTransferOwnership>
  );
};
