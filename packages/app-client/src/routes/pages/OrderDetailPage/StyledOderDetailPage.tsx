import styled from 'styled-components';

export const StyledOderDetailPage = styled.div`
  background-color: ${({ theme }) => theme.colors.current.surface2};

  .al-combo-field {
    margin-bottom: 2rem;
  }

  .al-page-section-label {
    margin-bottom: 0.74rem;
  }

  .al-card_order-id-scan {
    margin-bottom: 0.75rem;
  }

  .al-card-header__generic-slot {
    order: 2;
  }
`;
