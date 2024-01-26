import {
  Modal as CModal,
  ModalOverlay as CModalOverlay,
  ModalContent as CModalContent,
  ModalHeader as CModalHeader,
  ModalFooter as CModalFooter,
  ModalBody as CModalBody,
  ModalCloseButton as CModalCloseButton,
} from '@chakra-ui/react';
import { FC } from 'react';

import { MODAL_SIZES, ModalPropTypes } from './modal.types';

export const Modal: FC<ModalPropTypes> = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
}) => {
  return (
    <CModal isOpen={isOpen} onClose={onClose} size={{ base: MODAL_SIZES.MD }}>
      <CModalOverlay />
      <CModalContent>
        <CModalHeader>{title}</CModalHeader>
        <CModalCloseButton />
        <CModalBody>{children}</CModalBody>
        <CModalFooter>{footer}</CModalFooter>
      </CModalContent>
    </CModal>
  );
};
