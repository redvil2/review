import { FONT_WEIGHT } from '@app/shared/ui/theme';

import { StyledPageSectionLabel } from './pageSectionLabel.style';

export const PageSectionLabel = ({ children }) => (
  <StyledPageSectionLabel
    size={1}
    fontWeight={FONT_WEIGHT.MEDIUM}
    className={'al-page-section-label'}
  >
    {children}
  </StyledPageSectionLabel>
);
