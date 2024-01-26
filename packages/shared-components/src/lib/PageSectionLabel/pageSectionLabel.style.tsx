import styled from 'styled-components';

import { Paragraph } from '@app/shared/ui/components';

export const StyledPageSectionLabel = styled(Paragraph)`
  color: ${({ theme }) => theme.colors.current.secondary};
`;
