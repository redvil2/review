import { Card, CardInput, Modal } from '@app/shared/ui/components';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { RootDomainInstructions } from './RootDomainInstructions';
import { StyledInstructions } from './StyledInstructions';
import { SubDomainInstructions } from './SubDomainInstructions';

export const ConnectDomainModal = ({ isOpen, onClose, data }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const isRootDomain = data.qrDomain?.split('.').length === 2;

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: t('success.copiedToClipboard'),
        status: 'success',
      });
    } catch (err) {
      toast({
        title: t('error.failedToCopyToClipboard'),
        status: 'error',
      });
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('system.connectYourDomain')}
    >
      <Card
        input={
          <CardInput
            input={{
              label: t('system.yourDomainProvider'),
              inputValue: 'Default provider',
            }}
            hideEditIndicator
            readOnly
          />
        }
      />
      <StyledInstructions>
        {isRootDomain
          ? RootDomainInstructions({ data, copyToClipboard })
          : SubDomainInstructions({ data, copyToClipboard })}
      </StyledInstructions>
    </Modal>
  );
};
