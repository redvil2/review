import {
  Card,
  CardHeader,
  Headline,
  PageHeader,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Flex, useToast } from '@chakra-ui/react';
import { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@app/client/auth';
import { trpc } from '@app/client/trpc';

import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

export const PositionData = () => {
  const { userSettings } = useAuth();
  const { t } = useTranslation();

  const userSettingsUpdateMutation = trpc.user.settingsUpdate.useMutation({
    onSuccess: () => {
      navigate('/labels');
    },
    onError: error => {
      toast({
        title: t('error.failedToUpdatePositionInformation'),
        description: error.message,
        status: 'error',
      });
    },
  });
  const navigate = useNavigate();
  const toast = useToast();

  const onClick = async position => {
    if (userSettings?.position !== position || !!userSettings?.onboard) {
      userSettingsUpdateMutation.mutate({
        position: position,
        onboard: false,
      });
    } else {
      navigate('/labels');
    }
  };

  const positions: { intl: string; id: string }[] = [
    { intl: 'onboarding.design', id: 'design' },
    { intl: 'onboarding.marketing', id: 'marketing' },
    { intl: 'onboarding.customerService', id: 'customerService' },
    { intl: 'onboarding.accountManagement', id: 'accountManagement' },
    { intl: 'onboarding.it', id: 'it' },
    { intl: 'onboarding.management', id: 'management' },
    { intl: 'onboarding.printPress', id: 'printPress' },
    { intl: 'system.other', id: 'other' },
  ];
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <Fragment>
      <PageHeader
        btnLabel={t('onboarding.whatTypeIsYourCompany')}
        btnRoute={'/onboarding/company'}
      />
      <Flex
        ref={containerRef}
        direction={'column'}
        alignItems={'center'}
        pb={8}
      >
        <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
          {t('onboarding.whatIsYourPosition')}
        </Headline>
        {positions.map(position => (
          <Card
            key={position.id}
            onClick={() => onClick(position.id)}
            header={<CardHeader>{t(position.intl)}</CardHeader>}
          />
        ))}
      </Flex>
    </Fragment>
  );
};
