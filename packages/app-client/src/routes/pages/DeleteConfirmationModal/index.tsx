import { Button, Headline, Modal } from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { HStack, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  title,
  onConfirm,
}) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <VStack justifyContent={'center'} h={'100%'}>
        <Headline
          size={3}
          fontWeight={FONT_WEIGHT.SEMI_BOLD}
          textAlign={'center'}
        >
          {title}
        </Headline>
        <HStack justifyContent={'center'} mt={8}>
          <Button variant={'secondary'} onClick={onClose}>
            {t('system.cancel')}
          </Button>
          <Button error onClick={onConfirm}>
            {t('system.deleteConfirm')}
          </Button>
        </HStack>
      </VStack>
    </Modal>
  );
};
