import { StyledDimmer } from './dimmer.style';

export const Dimmer = ({ isDimming, children }) => (
  <StyledDimmer isDimming={isDimming} className={'al-dimmer'}>
    {children}
  </StyledDimmer>
);
