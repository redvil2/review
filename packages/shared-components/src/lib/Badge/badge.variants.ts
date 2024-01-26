import { EnumValues } from '@app/shared/type-util';

export const BADGE_VARIANTS = {
  DEFAULT: 'default',
  SURFACE: 'surface',
  SURFACE_VARIANT: 'surfaceVariant',
  TERTIARY: 'tertiary',
  AQUA: 'aqua',
  SUN: 'sun',
  GRASS: 'grass',
} as const;

export type BadgeVariant = EnumValues<typeof BADGE_VARIANTS>;
