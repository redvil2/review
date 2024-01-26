import { PageWrapper } from '@app/shared/ui/components';
import { useColorMode } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import { StyledOnboarding } from './StyledOnboarding';

export const Onboarding = () => {
  const { colorMode } = useColorMode();

  return (
    <StyledOnboarding $colorMode={colorMode}>
      <PageWrapper>
        <Outlet />
      </PageWrapper>
    </StyledOnboarding>
  );
};
