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
  PageHeader,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { DEFAULT_QR_DOMAIN } from '../../../constants';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';
import {
  defaultAddLabelState,
  useGlobalState,
} from '../../InterimContext/ContextProvider';

/**
 * @description Component handling the functionality to connect QR codes with their destinations. It is step 3 out of 5 of the add label flow.
 *
 * @returns {JSX.Element} A JSX element rendering the interface for connecting QR codes with destinations.
 *
 * @function ConnectCode
 */
export const ConnectCode = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const blurTimeout = useRef<null | ReturnType<typeof setTimeout>>(null);

  const resetDefaultQrDomain = () => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
    }
    setGlobalState({
      ...globalState,
      addLabels: { ...globalState.addLabels, qrDomain: DEFAULT_QR_DOMAIN },
    });
  };

  const {
    register,
    getValues,
    control,
    formState: { errors, isValid: isFormValid },
  } = useForm<{ target: string; fallback: string | null }>({
    mode: 'onChange',
    delayError: 1000,
    defaultValues: {
      target: globalState.addLabels.target ?? '',
      fallback: globalState.addLabels.fallback,
    },
  });
  const fallbackProps = useFallbackInput(control, errors);
  const qrDestinationProps = registerDestinationInput(register, errors);

  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <Box ref={containerRef}>
      <PageHeader
        btnLabel={t('addLabelFlow.editQrCodeDesign')}
        btnRoute={'/labels/add/edit'}
        xRoute={'/labels'}
        onX={() =>
          setGlobalState({ ...globalState, addLabels: defaultAddLabelState })
        }
      />
      <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
        {t('addLabelFlow.connectQrCode')}
      </Headline>
      <Box mb={'1rem'} className={'al-connect__description'}>
        <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
          {t(
            'addLabelFlow.theQrLinkForwardsVisitorsToTheQrDestinationTheQrDestinationCanBeChangedAnyTime',
          )}
        </Paragraph>
      </Box>
      <Card
        input={
          <CardInput
            input={{
              label: t('addLabelFlow.qrDomain'),
              inputValue: globalState.addLabels.qrDomain,
              onChange: e =>
                setGlobalState({
                  ...globalState,
                  addLabels: {
                    ...globalState.addLabels,
                    qrDomain: e.target.value,
                  },
                }),
            }}
            iconOnClick={() => resetDefaultQrDomain()}
            rightIconName={
              globalState.addLabels.qrDomain !== DEFAULT_QR_DOMAIN &&
              globalState.addLabels.qrDomain !== ''
                ? 'settings_backup_restore'
                : undefined
            }
          />
        }
      />
      <Box pl={'1rem'} className={'al-connect-qr-destination'}>
        <QRDestinationCard {...qrDestinationProps} />
      </Box>
      <FallbackInput {...fallbackProps} />
      <Flex my={'2rem'} justifyContent={'center'}>
        <Button
          onClick={() => {
            setGlobalState({
              ...globalState,
              addLabels: {
                ...globalState.addLabels,
                target: getValues('target') === '' ? null : getValues('target'),
                fallback: getValues('fallback'),
              },
            });
            navigate('/labels/add/options');
          }}
          isDisabled={!isFormValid}
        >
          {t('system.next')}
        </Button>
      </Flex>
    </Box>
  );
};
