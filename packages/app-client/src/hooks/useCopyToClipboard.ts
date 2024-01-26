import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const useCopyToClipboard = () => {
  const toast = useToast();
  const { t } = useTranslation();

  const copyToClipboard = async value => {
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

  return copyToClipboard;
};
