import {
  Badge,
  BADGE_VARIANTS,
  Button,
  Card,
  CardHeader,
  Icon,
  Loader,
  PageSectionLabel,
} from '@app/shared/ui/components';
import { HStack, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_QR_DOMAIN } from '@app/client/constants';
import { trpc } from '@app/client/trpc';

import { ReactComponent as FaviconPlaceholder } from '../../../../assets/icons/favicon-placeholder.svg';

export const DomainsView = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const {
    data: ownDomainNames,
    error,
    isLoading,
    isError,
  } = trpc.domainName.listOwn.useQuery();

  useEffect(() => {
    if (isError && error) {
      toast({
        title: t('error.failedToFetchDomains'),
        description: error.message,
        status: 'error',
      });
    }
  }, [error, isError]);
  return (
    <VStack w={'100%'} pl={4} mt={4}>
      <HStack
        justifyContent={'space-between'}
        w={'100%'}
        alignItems={'flex-end'}
        pb={4}
      >
        <PageSectionLabel>{t('system.domains')}</PageSectionLabel>
        <Button
          leftIcon={<Icon>add</Icon>}
          onClick={() => navigate('/domain/add')}
        />
      </HStack>
      {isLoading && <Loader />}
      {ownDomainNames?.domainNames.map(domainName => (
        <Card
          key={domainName.id}
          header={
            <CardHeader
              leftIcon={
                <Icon className={'al-domain-names-placeholder'}>public</Icon>
              }
              contextMenuItems={[
                {
                  id: 'connect',
                  name: t('system.connect'),
                  icon: <Icon>verified_user</Icon>,
                  onClick: () => navigate(`/domain/${domainName.id}/connect`),
                },
                {
                  id: 'favicon',
                  name: t('system.favicon'),
                  icon: <Icon>edit</Icon>,
                  isDisabled: true,
                  onClick: () => console.log('Edit domain'),
                },
                {
                  id: 'share',
                  name: t('system.share'),
                  icon: <Icon>share</Icon>,
                  isDisabled: true,
                  onClick: () => console.log('Share domain'),
                },
                {
                  id: 'delete',
                  name: t('system.delete'),
                  icon: <Icon>delete</Icon>,
                  destructive: true,
                  isDisabled: true,
                  onClick: () => console.log('Delete domain'),
                },
              ]}
            >
              {domainName.value}
            </CardHeader>
          }
        >
          <HStack>
            {domainName.status === 'VERIFICATION_PENDING' && (
              <Badge noDot variant={BADGE_VARIANTS.TERTIARY}>
                {t('system.connect')}
              </Badge>
            )}
            {/*{
              <Badge
                noDot
                variant={BADGE_VARIANTS.SURFACE_VARIANT}
                iconName={'lock'}
              >
                {t('settingsPage.onlyYou')}
              </Badge>
            }*/}
          </HStack>
        </Card>
      ))}
      <Card
        readOnly
        header={
          <CardHeader genericSlot={<FaviconPlaceholder />}>
            {DEFAULT_QR_DOMAIN}
          </CardHeader>
        }
      />
    </VStack>
  );
};
