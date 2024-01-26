import { Container } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../Button/Button';

import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: 'Components / Modal',
};

export default meta;

type Story = StoryObj<typeof Modal>;

const InteractiveModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal title={'Modal title'} isOpen={isOpen} onClose={onClose}>
        Content
      </Modal>
    </div>
  );
};

export const Default: Story = {
  args: {},
  render: () => <InteractiveModal />,
};
