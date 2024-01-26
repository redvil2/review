import {
  Button,
  Card,
  CardInput,
  Headline,
  Loader,
  PageHeader,
  Subline,
  Switch,
} from '@app/shared/ui/components';
import { FONT_WEIGHT, switchColor } from '@app/shared/ui/theme';
import {
  Box,
  Flex,
  HStack,
  useColorMode,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuthPrivate } from '@app/client/auth';
import { trpc } from '@app/client/trpc';

import { DEFAULT_QR_DOMAIN, PrintingMethod } from '../../../constants';
import { removeDelimiter } from '../../../helper';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';
import {
  defaultAddLabelState,
  useGlobalState,
} from '../../InterimContext/ContextProvider';

/**
 * @description Component for setting and managing the label name and related attributes in a QR label creation flow. It is step 5 out of 5 of the add label flow.
 *
 * @returns {JSX.Element} A JSX element rendering the interface for setting the label name and attributes.
 *
 * @function LabelName
 */
export const LabelName = () => {
  const { user, userSettings } = useAuthPrivate();
  const { globalState, setGlobalState } = useGlobalState();
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const toast = useToast();
  const createOrderMutation = trpc.order.create.useMutation({
    onError: error => {
      toast({
        title: t('error.failedToCreateOrder'),
        description: error.message,
        status: 'error',
      });
    },
    onSuccess: async (data, variables) => {
      toast({
        title: t('success.successfullyCreatedLabelAndOrder'),
        description: t('success.generationProcessHasBeenStarted'),
        status: 'success',
      });
      setGlobalState({ ...globalState, addLabels: defaultAddLabelState });
      navigate(`/project/${variables.projectId}`);
    },
  });
  const createProjectMutation = trpc.project.create.useMutation({
    onError: error => {
      toast({
        title: t('error.failedToCreateLabel'),
        description: error.message,
        status: 'error',
      });
    },
    onSuccess: async data => {
      createOrderMutation.mutate({
        projectId: data.project.id,
        targetUrl: globalState.addLabels.target,
        fallbackUrl: globalState.addLabels.fallback,
        orderLabel: globalState.addLabels.orderNo,
        amount: removeDelimiter(globalState.addLabels.amount),
      });
    },
  });

  useEffect(() => {
    if (user?.companyName) {
      setGlobalState({
        ...globalState,
        addLabels: {
          ...globalState.addLabels,
          ...(userSettings.companyType === 'PRINT_PROVIDER'
            ? { printProvider: user.companyName }
            : { labelCustomer: user.companyName }),
        },
      });
    }
  }, [user, userSettings]);

  const save = async () => {
    createProjectMutation.mutate({
      title: globalState.addLabels.projectName || 'Untitled Project',
      article: globalState.addLabels.article,
      label: globalState.addLabels.label,
      labelCustomer: globalState.addLabels.labelCustomer || null,
      printProvider: globalState.addLabels.printProvider || null,
      type: 'QR',
      printingMethod: globalState.addLabels.printingMethod as PrintingMethod,
      qrType: globalState.addLabels.qrType || 'SINGLE',
      bgColor: null,
      color: globalState.addLabels.color,
      shape: globalState.addLabels.shape,
      logoDataURI: globalState.addLabels.image?.dataUri,
      ...(globalState.addLabels.qrDomain !== DEFAULT_QR_DOMAIN
        ? { qrDomain: globalState.addLabels.qrDomain }
        : {}),
    });
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);
  useSequentialFadeIn(moreOptionsRef, showMore);

  return (
    <Box ref={containerRef}>
      <PageHeader
        btnLabel={t('addLabelFlow.labelOptions')}
        btnRoute={'/labels/add/options'}
        xRoute={'/labels'}
        onX={() =>
          setGlobalState({ ...globalState, addLabels: defaultAddLabelState })
        }
      />
      <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
        {t('addLabelFlow.setLabelName')}
      </Headline>
      <Card
        input={
          <CardInput
            input={{
              placeholder: t('addLabelFlow.projectName'),
              inputValue: globalState.addLabels.projectName,
              onChange: e =>
                setGlobalState({
                  ...globalState,
                  addLabels: {
                    ...globalState.addLabels,
                    projectName: e.target.value,
                  },
                }),
            }}
          />
        }
      />
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
            input={{
              inputValue: globalState.addLabels.orderNo,
              onChange: e =>
                setGlobalState({
                  ...globalState,
                  addLabels: {
                    ...globalState.addLabels,
                    orderNo: e.target.value,
                  },
                }),
            }}
          />
        }
      />
      <HStack justifyContent={'space-between'} mb={3}>
        <Subline
          size={2}
          fontWeight={FONT_WEIGHT.MEDIUM}
          className={'al-sub-headline'}
        >
          {t('addLabelFlow.moreOptions')}
        </Subline>
        <Switch isChecked={showMore} onChange={() => setShowMore(!showMore)} />
      </HStack>
      {showMore && (
        <VStack w={'100%'} ref={showMore && moreOptionsRef}>
          <Card
            input={
              <CardInput
                input={{
                  placeholder: `${t('addLabelFlow.article')}`,
                  inputValue: globalState.addLabels.article,
                  onChange: e =>
                    setGlobalState({
                      ...globalState,
                      addLabels: {
                        ...globalState.addLabels,
                        article: e.target.value,
                      },
                    }),
                }}
              />
            }
          />
          <Card
            input={
              <CardInput
                input={{
                  placeholder: t('addLabelFlow.labelCustomerNumber'),
                  inputValue: globalState.addLabels.label,
                  onChange: e =>
                    setGlobalState({
                      ...globalState,
                      addLabels: {
                        ...globalState.addLabels,
                        label: e.target.value,
                      },
                    }),
                }}
              />
            }
          />
          <Card
            input={
              <CardInput
                input={{
                  placeholder: t('addLabelFlow.printProvider'),
                  inputValue: globalState.addLabels.printProvider,
                  onChange: e =>
                    setGlobalState({
                      ...globalState,
                      addLabels: {
                        ...globalState.addLabels,
                        printProvider: e.target.value,
                      },
                    }),
                }}
              />
            }
          />
          <Card
            input={
              <CardInput
                input={{
                  placeholder: t('addLabelFlow.labelCustomer'),
                  inputValue: globalState.addLabels.labelCustomer,
                  onChange: e =>
                    setGlobalState({
                      ...globalState,
                      addLabels: {
                        ...globalState.addLabels,
                        labelCustomer: e.target.value,
                      },
                    }),
                }}
              />
            }
          />
        </VStack>
      )}
      <Flex my={'2rem'} justifyContent={'center'}>
        <Button onClick={save}>
          {createProjectMutation.isLoading || createOrderMutation.isLoading ? (
            <Loader size={'1.5rem'} color={switchColor(colorMode).secondary} />
          ) : (
            t('system.next')
          )}
        </Button>
      </Flex>
    </Box>
  );
};
