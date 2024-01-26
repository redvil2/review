import styled from 'styled-components';

import { DimmerPropTypes } from './dimmer.types';

export const StyledDimmer = styled.div<DimmerPropTypes>`
  ${({ isDimming }) => isDimming && 'opacity: 0.4;'}
`;
