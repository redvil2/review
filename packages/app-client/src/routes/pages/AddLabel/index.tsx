import { PageWrapper } from '@app/shared/ui/components';
import { useColorMode } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import { StyledAddLabels } from './StyledAddLabels';

export const AddLabelPage = () => {
  const { colorMode } = useColorMode();
  return (
    <StyledAddLabels $colorMode={colorMode}>
      <PageWrapper>
        <Outlet />
      </PageWrapper>
    </StyledAddLabels>
  );
};
