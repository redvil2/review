import { ColorMode } from '@chakra-ui/react';

export interface LineChartItem {
  timestamp: number;
  count: number;
}
export interface LineChartCanvasProps {
  items: LineChartItem[];
  maxValueY: number;
  stepsX: number;
  stepsY: number;
}
export interface LineChartProps {
  items: LineChartItem[];
  labels: string[];
}
export interface StyledLineChartCanvasProps {
  $colorMode: ColorMode;
}
