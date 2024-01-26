import { PageWrapper } from '@app/shared/ui/components';
import React, { useRef } from 'react';

import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';
import { TeamMembers } from '../AddTeam/TeamMembers';

import { StyledEditTeam } from './editTeam.styles';

export const EditTeam = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);
  return (
    <StyledEditTeam>
      <PageWrapper ref={containerRef}>
        <TeamMembers edit />
      </PageWrapper>
    </StyledEditTeam>
  );
};
