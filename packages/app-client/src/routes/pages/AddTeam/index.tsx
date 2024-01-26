import { PageWrapper } from '@app/shared/ui/components';
import { Outlet } from 'react-router-dom';

import { StyledAddTeam } from './StyledAddTeam';

export const AddTeam = () => {
  return (
    <StyledAddTeam>
      <PageWrapper>
        <Outlet />
      </PageWrapper>
    </StyledAddTeam>
  );
};
