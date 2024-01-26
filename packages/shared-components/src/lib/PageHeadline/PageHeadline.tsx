import { FONT_WEIGHT } from '@app/shared/ui/theme';

import { StyledPageHeadline } from './pageHeadline.style';

export const PageHeadline = ({ children, ...rest }) => (
  <StyledPageHeadline
    size={3}
    fontWeight={FONT_WEIGHT.SEMI_BOLD}
    textAlign={'center'}
    {...rest}
  >
    {children}
  </StyledPageHeadline>
);
