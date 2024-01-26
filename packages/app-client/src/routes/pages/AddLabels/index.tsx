import {
  FallbackInput,
  QRDestinationCard,
  registerDestinationInput,
  useFallbackInput,
} from '@app/core/web/ui';
import {
  Button,
  Card,
  CardInput,
  Headline,
  Loader,
  PageHeader,
  PageWrapper,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, useColorMode, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { ReactComponent as AllLabels } from '../../../assets/icons/all-labels.svg';
import { DEFAULT_QR_DOMAIN } from '../../../constants';
import { addDelimiter, removeDelimiter } from '../../../helper';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

import { StyledAddLabels } from './StyledAddLabels';

export const AddLabelsPage = () => {
  const [amount, setAmount] = useState('');
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const { projectId } = useParams();
  const {
    data: projectData,
    isError: projectIsError,
    error: projectError,
  } = trpc.project.getById.useQuery({
    id: Number(projectId),
  });
  const {
    data: orderData,
    isLoading: ordersLoading,
    isError: orderIsError,
    error: orderError,
    refetch: refetchOrderList,
  } = trpc.order.list.useQuery({
    projectId: Number(projectId),
  });
  const {
    data: orderNextIdData,
    isError: nextOrderIdIsError,
    error: nextOrderIdError,
  } = trpc.order.nextId.useQuery({
    projectId: Number(projectId),
  });
  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors, isValid: isFormValid },
  } = useForm<{ target: string; fallback: string | null }>({
    mode: 'onChange',
    delayError: 1000,
  });
  const fallbackProps = useFallbackInput(control, errors);
  const qrDestinationProps = registerDestinationInput(register, errors);

  const createOrderMutation = trpc.order.create.useMutation({
    onError: error => {
      toast({
        title: t('error.failedToCreateOrder'),
        description: error.message,
        status: 'error',
      });
    },
    onSuccess: async () => {
      if (projectData?.project?.qrType === 'SERIAL') {
        toast({
          title: t('success.successfullyCreatedOrder'),
          status: 'success',
        });
      }
      await refetchOrderList();
      navigate(`/project/${projectId}`);
    },
  });

  useEffect(() => {
    if (orderData && orderData?.orders.length > 0) {
      const lastOrder = orderData.orders[orderData.orders.length - 1];
      setAmount(String(lastOrder.amount));
      setValue(
        'target',
        lastOrder.targetUrl === null ? '' : lastOrder.targetUrl,
      );
      setValue('fallback', lastOrder.fallbackUrl);
    }
  }, [orderData === undefined]); //note the condition, should trigger only once on initial load

  useEffect(() => {
    if (projectIsError && projectError) {
      toast({
        title: t('error.failedToFetchLabel'),
        description: projectError.message,
        status: 'error',
      });
    }
    if (orderIsError && orderError) {
      toast({
        title: t('error.failedToFetchLabel'),
        description: orderError.message,
        status: 'error',
      });
    }
    if (nextOrderIdIsError && nextOrderIdError) {
      toast({
        title: t('error.failedToFetchOrderId'),
        description: nextOrderIdError.message,
        status: 'error',
      });
    }
  }, [
    projectIsError,
    projectError,
    orderIsError,
    orderError,
    nextOrderIdIsError,
    nextOrderIdError,
    t,
    toast,
  ]);

  const handleAddLabels = () => {
    createOrderMutation.mutate({
      projectId: Number(projectId),
      targetUrl: getValues('target') !== '' ? getValues('target') : null,
      fallbackUrl: getValues('fallback'),
      orderLabel: orderNextIdData ? String(orderNextIdData?.nextOrderId) : '0',
      amount: Number(removeDelimiter(amount)),
    });
  };
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);
  return (
    <StyledAddLabels $colorMode={colorMode}>
      <PageWrapper ref={containerRef}>
        <PageHeader
          btnLabel={projectData?.project?.title}
          btnRoute={`/project/${projectId}`}
        />
        <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
          {t('system.addOrder')}
        </Headline>
        {ordersLoading && (
          <Flex justifyContent={'center'} alignItems={'center'} mt={'45%'}>
            <Loader />
          </Flex>
        )}
        {!ordersLoading && orderData?.orders && (
          <>
            <Card
              input={
                <CardInput
                  leftIcon={<AllLabels />}
                  input={{
                    placeholder: t('addLabelFlow.amountOfLabels'),
                    inputValue: addDelimiter(amount),
                    onChange: e => setAmount(addDelimiter(e.target.value)),
                  }}
                />
              }
            />
            <Card
              readOnly
              input={
                <CardInput
                  readOnly
                  input={{
                    label: t('addLabelFlow.qrDomain'),
                    inputValue:
                      projectData?.project.qrDomainName?.value ??
                      `${DEFAULT_QR_DOMAIN}`,
                  }}
                />
              }
            />
            <QRDestinationCard {...qrDestinationProps} />
            <FallbackInput {...fallbackProps} />
          </>
        )}
        <Flex my={'2rem'} justifyContent={'flex-end'}>
          <Box mr={4}>
            <Button
              variant={'secondary'}
              onClick={() => navigate(`/project/${projectId}`)}
            >
              {t('system.cancel')}
            </Button>
          </Box>
          <Button isDisabled={!isFormValid} onClick={handleAddLabels}>
            {t('system.addOrder')}
          </Button>
        </Flex>
      </PageWrapper>
    </StyledAddLabels>
  );
};
