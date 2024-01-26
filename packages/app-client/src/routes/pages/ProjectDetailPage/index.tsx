import {
  Avatar,
  AVATAR_VARIANTS,
  AvatarGroup,
  Badge,
  BADGE_VARIANTS,
  Button,
  Card,
  CardFooter,
  CardHeader,
  ContextMenuItem,
  Headline,
  Icon,
  Loader,
  PageHeader,
  PageWrapper,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, HStack, useColorMode, useToast } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuthPrivate } from '@app/client/auth';
import { trpc } from '@app/client/trpc';

import { ReactComponent as AllLabels } from '../../../assets/icons/all-labels.svg';
import { ReactComponent as QrStack } from '../../../assets/icons/ctsm-qr-bulk.svg';
import { add10Percent, addDelimiter, removeDelimiter } from '../../../helper';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';

import { StyledProjectDetails } from './StyledProjectDetails';

export const ProjectDetailPage = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const { projectId } = useParams();
  const [
    showProjectDeleteConfirmationModal,
    setShowProjectDeleteConfirmationModal,
  ] = useState(false);
  const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);
  const [openCardIdx, setOpenCardIdx] = useState<number | null>(null);
  const {
    data: projectData,
    isLoading: projectLoading,
    isError: projectIsError,
    error: projectError,
  } = trpc.project.getById.useQuery({
    id: Number(projectId),
  });
  const {
    data: orderData,
    isLoading: ordersLoading,
    isError: ordersIsError,
    error: orderError,
    refetch: refetchOrderList,
  } = trpc.order.list.useQuery({
    projectId: Number(projectId),
  });

  const {
    data: visitsData,
    isError: visitsIsError,
    error: visistsError,
  } = trpc.analytics.project.useQuery({
    projectId: Number(projectId),
  });

  const { data: accessData } = trpc.access.getByProjectId.useQuery({
    projectId: Number(projectId),
  });

  const { data: memberData } = trpc.project.getMembers.useQuery({
    id: Number(projectId),
  });

  const { user } = useAuthPrivate();

  const orderCreateDownloadLinkMutation =
    trpc.order.createDownloadLink.useMutation({
      onError: err => {
        if (err.data?.code == 'NOT_FOUND') {
          toast({
            title: 'Please wait for the generation to finish',
            status: 'warning',
          });
          return;
        }

        toast({
          title: 'Failed to download QR',
          status: 'error',
        });
      },
      onSuccess: (data, input) => {
        const order = orderData?.orders.find(x => x.id == input.id);
        toast({
          title: 'Successfully started downloading QR',
          status: 'success',
        });
        const link = document.createElement('a');
        link.href = data;
        link.download = `${projectData?.project.title} - ${order?.orderLabel}.${
          projectData?.project.qrType === 'SERIAL' ? 'zip' : 'png'
        }`;
        link.click();
      },
    });

  const deleteProjectMutation = trpc.project.delete.useMutation();
  const deleteOrderMutation = trpc.order.delete.useMutation({
    onSuccess: async () => {
      setDeleteOrder(null);
    },
  });

  useEffect(() => {
    if (projectIsError && projectError) {
      toast({
        title: t('error.failedToFetchLabel'),
        description: projectError.message,
        status: 'error',
      });
    }
    if (ordersIsError && orderError) {
      toast({
        title: t('error.failedToFetchOrders'),
        description: orderError.message,
        status: 'error',
      });
    }
    if (visitsIsError && visistsError) {
      toast({
        title: t('error.failedToFetchVisitorData'),
        description: visistsError.message,
        status: 'error',
      });
    }
  }, [
    projectIsError,
    projectError,
    ordersIsError,
    orderError,
    visitsIsError,
    visistsError,
    toast,
    t,
  ]);

  const handleDeleteProject = (id: number, title: string) =>
    deleteProjectMutation.mutate(
      {
        id,
      },
      {
        onError: error => {
          toast({
            title: `Failed to delete ${title}`,
            description: error.message,
            status: 'error',
          });
        },
        onSuccess: () => {
          toast({
            title: `Successfully deleted ${title}`,
            status: 'success',
          });
          navigate('/labels');
        },
      },
    );

  const handleDeleteOrder = async (id: number, label: string) => {
    deleteOrderMutation.mutate(
      {
        id,
      },
      {
        onError: error => {
          toast({
            title: `Failed to delete order ${label}`,
            description: error.message,
            status: 'error',
          });
        },
        onSuccess: async () => {
          await refetchOrderList();
          toast({
            title: `Successfully deleted order ${label}`,
            status: 'success',
          });
        },
      },
    );
  };

  const handleDownload = (order: Order) => {
    orderCreateDownloadLinkMutation.mutate({
      id: order.id,
    });
  };

  const hasVisits = (orderId: number) => {
    const data = visitsData?.find(visit => visit.orderId === Number(orderId));
    return data?.visits ? data : undefined;
  };

  const isLinked = (order: Order) =>
    order.targetUrl === null ? 'link_off' : 'link';

  const hasAccess =
    accessData?.accessType === 'WRITE' || accessData?.accessType === null;
  const isOwner = projectData?.project.userId === user.id;

  const projectContextMenuItems: ContextMenuItem[] = [
    {
      id: 2,
      name: t('projectPage.renameLabel'),
      onClick: () => navigate(`/project/${projectId}/edit`),
      icon: <Icon className="__menu_icon">edit</Icon>,
    },
  ];

  if (isOwner) {
    projectContextMenuItems.splice(1, 0, {
      id: 1,
      name: t('projectPage.transfer'),
      onClick: () => navigate(`/project/${projectId}/transfer`),
      icon: <Icon className="__menu_icon">swap_horiz</Icon>,
    });
    projectContextMenuItems.push({
      id: 3,
      name: t('projectPage.deleteLabel'),
      onClick: () => setShowProjectDeleteConfirmationModal(true),
      destructive: true,
      icon: <Icon className="__menu_icon">delete</Icon>,
    });
  }
  const containerRef = useRef<HTMLDivElement>(null);

  const avatarColor = [
    AVATAR_VARIANTS.SURFACE_VARIANT,
    AVATAR_VARIANTS.SUN,
    AVATAR_VARIANTS.TERTIARY,
  ];

  useSequentialFadeIn(containerRef);

  return (
    <StyledProjectDetails $colorMode={colorMode}>
      <PageWrapper ref={containerRef}>
        <PageHeader
          btnLabel={t('system.allLabels')}
          btnRoute={'/labels'}
          contextMenu={
            hasAccess && (projectLoading || !projectData)
              ? []
              : projectContextMenuItems
          }
        />
        {projectLoading && (
          <Flex justifyContent={'center'} alignItems={'center'} mt={'45%'}>
            <Loader />
          </Flex>
        )}
        {!projectLoading && projectData && (
          <>
            <Box mt={8}>
              <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
                {projectData.project.title}
              </Headline>
            </Box>
            <Flex justifyContent={'space-between'} mt={'2rem'} mb={'0.75rem'}>
              <HStack gap={0}>
                {hasAccess && (
                  <Button
                    className={'btn-share'}
                    leftIcon={<Icon>person_add</Icon>}
                    onClick={() => navigate(`/project/${projectId}/share`)}
                  />
                )}
                <Box ml={hasAccess ? '-1rem' : 0}>
                  <AvatarGroup
                    onClick={
                      hasAccess
                        ? undefined
                        : () => navigate(`/project/${projectId}/shared`)
                    }
                  >
                    {memberData
                      ?.filter(({ receiverType }) => receiverType === 'USER')
                      .map(({ id, receivingUser }, idx) => (
                        <Avatar
                          key={id}
                          variant={avatarColor[idx]}
                        >{`${receivingUser?.firstName} ${receivingUser?.lastName}`}</Avatar>
                      ))}
                  </AvatarGroup>
                </Box>
              </HStack>
              <Button
                size={'medium'}
                onClick={() => navigate(`/project/${projectId}/add`)}
              >
                {t('system.addOrder')}
              </Button>
            </Flex>
            {ordersLoading && (
              <Flex justifyContent={'center'} alignItems={'center'} mt={'45%'}>
                <Loader />
              </Flex>
            )}
            {!ordersLoading && orderData?.orders.length === 0 && (
              <Flex
                className="al-empty-state-text"
                justifyContent={'center'}
                alignItems={'center'}
                mt={'45%'}
              >
                <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
                  {t('projectPage.noOrders')}
                </Paragraph>
              </Flex>
            )}
            {!ordersLoading &&
              orderData?.orders.map((order, idx) => (
                <Card
                  key={order.id}
                  zIndex={openCardIdx === idx ? 1000 : 1}
                  header={
                    <CardHeader
                      rightIcon={{
                        name: 'open_in_new',
                        onClick: ev => {
                          ev.stopPropagation();
                          window.open(
                            order.targetUrl ?? order.fallbackUrl ?? '',
                            '_blank',
                          );
                        },
                      }}
                      onMenuClick={() => setOpenCardIdx(idx)}
                      contextMenuItems={
                        hasAccess
                          ? [
                              {
                                id: 1,
                                name: t('system.order'),
                                onClick: ev => {
                                  ev.stopPropagation();
                                  navigate(
                                    `/project/${projectId}/order/${order.id}`,
                                  );
                                },
                                icon: <Icon>edit</Icon>,
                              },
                              {
                                id: 2,
                                name: t('projectPage.qrCode'),
                                onClick: ev => {
                                  ev.stopPropagation();
                                  handleDownload(order);
                                },
                                icon: (
                                  <Icon style={{ fontSize: '1.25rem' }}>
                                    download
                                  </Icon>
                                ),
                              },
                              {
                                id: 3,
                                name: t('projectPage.analytics'),
                                onClick: ev => {
                                  ev.stopPropagation();
                                  navigate(
                                    `/project/${projectId}/order/${order.id}/analytics`,
                                  );
                                },
                                icon: <Icon>monitoring</Icon>,
                              },
                              {
                                id: 4,
                                name: t('projectPage.deleteOrder'),
                                onClick: ev => {
                                  ev.stopPropagation();
                                  setDeleteOrder(order);
                                },
                                destructive: true,
                                icon: <Icon>delete</Icon>,
                              },
                            ]
                          : undefined
                      }
                      contextMenuVariant={'blueAndLeft'}
                      leftIcon={
                        isLinked(order) === 'link_off' && (
                          <Icon
                            className={`al-connect-icon ${isLinked(order)}`}
                          >
                            {isLinked(order)}
                          </Icon>
                        )
                      }
                    >
                      {`${t('system.order')} #${order?.orderLabel || ''}`}
                    </CardHeader>
                  }
                  footer={
                    <CardFooter
                      actions={
                        hasAccess ? (
                          <Flex justifyContent={'flex-end'} pb={4} pr={4}>
                            {order.targetUrl === null && (
                              <Box ml={2}>
                                <Button
                                  variant={'secondary'}
                                  size={'small'}
                                  leftIcon={<Icon>add</Icon>}
                                  onClick={() =>
                                    navigate(
                                      `/project/${projectId}/order/${order.id}`,
                                    )
                                  }
                                >
                                  {t('addLabelFlow.qrDestination')}
                                </Button>
                              </Box>
                            )}
                          </Flex>
                        ) : undefined
                      }
                    >
                      <Flex>
                        {order.status == 'PROCESSING' ? (
                          <Badge
                            iconName={'cached'}
                            variant={BADGE_VARIANTS.SUN}
                            noDot
                          >
                            {t('projectPage.generating')} (
                            {order.qrCodesProgress ?? 0}
                            %)
                          </Badge>
                        ) : (
                          <Flex
                            alignItems={'center'}
                            onClick={() =>
                              navigate(
                                `/project/${projectId}/order/${order.id}/analytics`,
                              )
                            }
                          >
                            <Box mr={1}>
                              <Badge noDot>
                                {addDelimiter(hasVisits(order.id)?.visits) || 0}
                              </Badge>
                            </Box>
                            <Paragraph
                              className={'al-visits-text'}
                              size={2}
                              fontWeight={FONT_WEIGHT.REGULAR}
                            >
                              {t('projectPage.scan', {
                                count: hasVisits(order.id)?.visits || 2,
                              })}
                            </Paragraph>
                          </Flex>
                        )}
                      </Flex>
                    </CardFooter>
                  }
                >
                  {(projectData.project.article ||
                    projectData.project.label) && (
                    <HStack className={'al-detail-stats'}>
                      <Flex
                        alignItems={'center'}
                        ml={'10px'}
                        mb={'8px'}
                        letterSpacing="wider"
                      >
                        <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
                          {[
                            projectData.project.article &&
                              `Article #${projectData.project.article}`,
                            projectData.project.label &&
                              `Label #${projectData.project.label}`,
                          ]
                            .filter(Boolean)
                            .join(' | ')}
                        </Paragraph>
                      </Flex>
                    </HStack>
                  )}
                  <HStack
                    className={'al-detail-stats'}
                    onClick={() =>
                      navigate(`/project/${projectId}/order/${order.id}/ids`)
                    }
                  >
                    <Flex alignItems={'center'} mr={'1rem'}>
                      <AllLabels className={'icon-all-labels'} />
                      <Paragraph size={2} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
                        {addDelimiter(order.amount)}
                      </Paragraph>
                    </Flex>
                    <Flex alignItems={'center'}>
                      {projectData.project.qrType !== 'SERIAL' ? (
                        <Icon className={'icon-preview-qr'}>qr_code_2</Icon>
                      ) : (
                        <QrStack className={'icon-preview-qr'} />
                      )}
                      <Paragraph size={2} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
                        {(projectData.project.printingMethod === 'OFFSET' ||
                          projectData.project.printingMethod === 'FLEXO') &&
                          '1'}
                        {(projectData.project.printingMethod === 'DIGITAL' ||
                          projectData.project.printingMethod ===
                            'FLEXO_INKJET') &&
                          add10Percent(removeDelimiter(order.amount), true)}
                      </Paragraph>
                    </Flex>
                  </HStack>
                </Card>
              ))}
          </>
        )}
      </PageWrapper>
      <DeleteConfirmationModal
        isOpen={deleteOrder !== null}
        onConfirm={() =>
          handleDeleteOrder(
            (deleteOrder as Order).id,
            (deleteOrder as Order).orderLabel,
          )
        }
        onClose={() => setDeleteOrder(null)}
        title={t('projectPage.deleteOrderTitle')}
      />
      <DeleteConfirmationModal
        isOpen={showProjectDeleteConfirmationModal}
        onConfirm={() =>
          handleDeleteProject(
            Number(projectId),
            projectData?.project?.title as string,
          )
        }
        onClose={() => setShowProjectDeleteConfirmationModal(false)}
        title={t('projectPage.deleteProjectTitle')}
      />
    </StyledProjectDetails>
  );
};
