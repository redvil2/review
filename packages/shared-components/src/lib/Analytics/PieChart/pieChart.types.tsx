import { PieChartVariant } from './pieChart.variants';

export interface PieChartProps {
  items: PieChartItem[];
  center: boolean;
}
export type PieChartItem = {
  color: PieChartVariant;
  count: number;
  key: string;
  initial?: boolean;
};
