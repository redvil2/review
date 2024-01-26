import {
  Button,
  Card,
  CardInput,
  Dimmer,
  Loader,
  PageHeader,
  PageHeadline,
  PageWrapper,
} from '@app/shared/ui/components';
import { useToast, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useSequentialFadeIn } from '@app/client/hooks/useSequentialFadeIn';
import { StyledAddDomain } from '@app/client/routes/pages/AddDomain/StyledAddDomain';
import { trpc } from '@app/client/trpc';

export const AddDomain = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const [newDomainName, setNewDomainName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const createDomainMutation = trpc.domainName.create.useMutation({
    onSuccess: () => navigate('/settings/domains'),
    onError: error => {
      toast({
        title: t('error.failedToCreateDomain'),
        description: error.message,
        status: 'error',
      });
    },
  });

  const getDomainType = domain => {
    const pattern = /^(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

    if (pattern.test(domain)) {
      if (domain.split('.').length === 2) {
        return 'ROOT';
      } else if (domain.split('.').length === 3) {
        return 'CNAME';
      } else {
        return 'INVALID';
      }
    }
    return 'INVALID';
  };

  const handleSave = async () => {
    const domainType = getDomainType(newDomainName);
    if (domainType === 'INVALID') {
      toast({
        title: t('error.invalidDomain'),
        status: 'error',
      });
      return;
    }
    await createDomainMutation.mutateAsync({
      type: domainType,
      value: newDomainName,
    });
  };

  useSequentialFadeIn(containerRef);
  return (
    <StyledAddDomain>
      <PageWrapper ref={containerRef}>
        <PageHeader xRoute={'/settings/domains'} />
        <VStack
          justifyContent={'center'}
          alignItems={'center'}
          w={'100%'}
          flex={1}
          mt={'-2rem'}
        >
          <Dimmer isDimming={createDomainMutation.isLoading}>
            <PageHeadline>{t('connectDomainPage.addNewDomain')}</PageHeadline>
            <Card
              input={
                <CardInput
                  isInvalid={newDomainName.includes('http')}
                  input={{
                    inputValue: newDomainName,
                    placeholder: t('connectDomainPage.enterNewDomain'),
                    onChange: e => setNewDomainName(e.target.value),
                    errorMessage: t('connectDomainPage.removeHttps'),
                  }}
                  rightIconName={'cancel'}
                  iconOnClick={() => setNewDomainName('')}
                />
              }
            />
          </Dimmer>
          <Button
            className={'al-save'}
            isDisabled={!newDomainName}
            onClick={handleSave}
          >
            {createDomainMutation.isLoading ? (
              <Loader size={4} color={'white'} />
            ) : (
              t('system.save')
            )}
          </Button>
        </VStack>
      </PageWrapper>
    </StyledAddDomain>
  );
};
