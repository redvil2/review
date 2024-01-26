import {
  QRDestinationCard,
  FallbackInput,
  useFallbackInput,
  registerDestinationInput,
} from '@app/core/web/ui';
import {
  Button,
  Card,
  CardInput,
  Headline,
  Loader,
  PageHeader,
  PageWrapper,
  Subline,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, useColorMode, useToast } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

import { StyledEditOrder } from './StyledEditOrderPage';

const EditOrderForm = ({
  defaultName,
  defaultTargetUrl,
  defaultFallbackUrl,
  onCancel,
  onConfirm,
}: {
  defaultName: string;
  defaultTargetUrl: string | null;
  defaultFallbackUrl: string | null;
  onCancel: () => void;
  onConfirm: (values: {
    targetUrl: string | null;
    fallbackUrl: string | null;
    label: string;
  }) => void;
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid: isFormValid },
    control,
  } = useForm<{
    name: string;
    target: string;
    fallback: string | null;
  }>({
    defaultValues: {
      name: defaultName,
      target: defaultTargetUrl ?? '',
      fallback: defaultFallbackUrl,
    },
    mode: 'onChange',
    delayError: 1000,
  });
  const { t } = useTranslation();
  const fallbackProps = useFallbackInput(control, errors);
  const qrDestinationProps = registerDestinationInput(register, errors);
  const containerRef = useRef<HTMLFormElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit(({ name, target, fallback }) => {
        onConfirm({
          label: name,
          targetUrl: target === '' ? null : target,
          fallbackUrl: fallback,
        });
      })}
    >
      <Card
        input={
          <CardInput
            genericSlot={
              <Subline
                className={'order-no'}
                size={2}
                fontWeight={FONT_WEIGHT.SEMI_BOLD}
              >
                {`${t('system.order')} #`}
              </Subline>
            }
            isInvalid={errors.name?.type === 'required'}
            input={{
              placeholder: t('projectPage.orderName'),
              ...register('name', { required: true }),
              errorMessage: 'Order number is required',
            }}
          />
        }
      />
      <QRDestinationCard {...qrDestinationProps} />
      <FallbackInput {...fallbackProps} />
      <Flex my={'2rem'} justifyContent={'flex-end'}>
        <Box mr={4}>
          <Button variant={'secondary'} onClick={onCancel}>
            {t('system.cancel')}
          </Button>
        </Box>
        <Button type="submit" isDisabled={!isFormValid}>
          {t('system.save')}
        </Button>
      </Flex>
    </form>
  );
};

export const EditOrderPage = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const { projectId, orderId } = useParams();
  const {
    data: projectData,
    isLoading,
    isError,
    error,
  } = trpc.project.getById.useQuery({
    id: Number(projectId),
  });
  const { data: orderData, refetch: refetchOrder } =
    trpc.order.getById.useQuery({
      id: Number(orderId),
    });
  const updateOrderMutation = trpc.order.update.useMutation({
    onSuccess: () => {
      refetchOrder();
      toast({
        title: t('success.successfullyUpdatedOrder'),
        status: 'success',
      });
      navigate(`/project/${projectId}`);
    },
    onError: () => {
      toast({
        title: t('error.failedToUpdateOrder'),
        status: 'error',
      });
    },
  });
  useEffect(() => {
    if (isError && error) {
      toast({
        title: t('error.failedToFetchLabel'),
        description: error.message,
        status: 'error',
      });
    }
  }, [isError, error, toast]);

  const handleSave = ({
    targetUrl,
    fallbackUrl,
    label,
  }: {
    targetUrl: string | null;
    fallbackUrl: string | null;
    label: string;
  }) => {
    updateOrderMutation.mutate({
      id: Number(orderId),
      targetUrl: targetUrl === '' ? null : targetUrl,
      fallbackUrl,
      orderLabel: label,
    });
  };

  return (
    <StyledEditOrder $colorMode={colorMode}>
      <PageWrapper>
        <PageHeader
          btnLabel={projectData?.project?.title || ''}
          btnRoute={`/project/${projectId}`}
          xRoute={`/project/${projectId}`}
        />
        <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
          {`${t('addLabelFlow.editOrder')}`}
        </Headline>
        {isLoading || !orderData ? (
          <Loader />
        ) : (
          <EditOrderForm
            defaultName={orderData.order.orderLabel}
            defaultTargetUrl={orderData.order.targetUrl}
            defaultFallbackUrl={orderData.order.fallbackUrl}
            onCancel={() => navigate(`/project/${projectId}`)}
            onConfirm={handleSave}
          />
        )}
      </PageWrapper>
    </StyledEditOrder>
  );
};
