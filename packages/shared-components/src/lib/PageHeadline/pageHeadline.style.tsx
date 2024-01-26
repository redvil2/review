import styled from 'styled-components';

import { Headline } from '@app/shared/ui/components';

export const StyledPageHeadline = styled(Headline)`
  color: ${({ theme }) => theme.colors.current.onPrimaryContainer};
  width: 100%;
  margin: 2.75rem 0;
`;
