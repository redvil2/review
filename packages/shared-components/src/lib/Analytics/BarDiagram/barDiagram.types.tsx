export interface BarDiagramProps {
  items: BarDiagramItem[];
  center: boolean;
}
export type BarDiagramItem = {
  count: number;
  key: string;
};
