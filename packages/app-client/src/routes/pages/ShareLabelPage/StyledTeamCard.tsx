import { Card } from '@app/shared/ui/components';
import styled from 'styled-components';

export const StyledTeamCard = styled(Card)`
  .al-card-header__front {
    flex: 1 1 auto;
    justify-content: space-between;
  }

  .al-card-header__generic-slot {
    order: 2;
  }

  .al-card-header__title {
    order: 1;
  }
`;
