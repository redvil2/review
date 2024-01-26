import { switchColor } from '@app/shared/ui/theme';
import styled from 'styled-components';

import { StyledLineChartCanvasProps } from './lineChart.types';

export const StyledLineChartCanvas = styled.canvas<StyledLineChartCanvasProps>`
  border-radius: 1rem;
  border: 1px solid
    ${({ $colorMode }) => switchColor($colorMode).outlineVariant};
  width: 100%;
`;
