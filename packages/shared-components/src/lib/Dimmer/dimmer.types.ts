import { ReactNode } from 'react';

export interface DimmerPropTypes {
  isDimming: boolean;
  children: ReactNode;
  spareOutElementIds: string[];
}
