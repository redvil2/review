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

import { CompanyType } from '../../../constants';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

export const CompanyData = () => {
  const { userSettings } = useAuth();
  const userSettingsUpdateMutation = trpc.user.settingsUpdate.useMutation({
    onSuccess: () => {
      navigate('/onboarding/position');
    },
    onError: error => {
      toast({
        title: t('error.failedToUpdateCompanyInformation'),
        description: error.message,
        status: 'error',
      });
    },
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();

  const onClick = async companyType => {
    if (companyType !== userSettings?.companyType) {
      userSettingsUpdateMutation.mutate({ companyType });
    } else {
      navigate('/onboarding/position');
    }
  };
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <Fragment>
      <PageHeader
        btnLabel={t('onboarding.setUpYourAccount')}
        btnRoute={'/onboarding/account'}
      />
      <Flex ref={containerRef} direction={'column'} alignItems={'center'}>
        <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
          {t('onboarding.whatTypeIsYourCompany')}
        </Headline>
        <Card
          onClick={() => onClick('LABEL_CUSTOMER' satisfies CompanyType)}
          header={<CardHeader>{t('onboarding.labelCustomer')}</CardHeader>}
        />
        <Card
          onClick={() => onClick('PRINT_PROVIDER' satisfies CompanyType)}
          header={<CardHeader>{t('onboarding.printProvider')}</CardHeader>}
        />
        <Card
          onClick={() => onClick('SOLUTION_PROVIDER' satisfies CompanyType)}
          header={<CardHeader>{t('onboarding.solutionProvider')}</CardHeader>}
        />
        <Card
          onClick={() => onClick('OTHER' satisfies CompanyType)}
          header={<CardHeader>{t('system.other')}</CardHeader>}
        />
      </Flex>
    </Fragment>
  );
};
