import { EnumValues } from '@app/shared/type-util';

export const PIE_CHART_VARIANTS = {
  CLEAR: 'clear',
  AZURE: 'azure',
  MELROSE: 'melrose',
  CARDINAL: 'cardinal',
  COSMOS: 'cosmos',
  STRATOS: 'stratos',
  FOG: 'fog',
  COMET: 'comet',
  MIRAGE: 'mirage',
} as const;

export type PieChartVariant = EnumValues<typeof PIE_CHART_VARIANTS>;
