import { EnumValues } from '@app/shared/type-util';
import { switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';

export const AVATAR_VARIANTS = {
  OCEAN: 'ocean',
  SURFACE: 'surface',
  SURFACE_VARIANT: 'surfaceVariant',
  TERTIARY: 'tertiary',
  AQUA: 'aqua',
  SUN: 'sun',
  GRASS: 'grass',
} as const;

export type AvatarVariants = EnumValues<typeof AVATAR_VARIANTS>;

export const avatarColors = (colorMode: ColorMode) => ({
  surface: {
    color: switchColor(colorMode).onSurfaceVariant,
    background: switchColor(colorMode).surface,
  },
  surfaceVariant: {
    color: switchColor(colorMode).onSurfaceVariant,
    background: switchColor(colorMode).surfaceVariant,
  },
  tertiary: {
    color: switchColor(colorMode).tertiary,
    background: switchColor(colorMode).tertiaryContainer,
  },
  ocean: {
    color: switchColor(colorMode).extended.ocean.color,
    background: switchColor(colorMode).extended.ocean.colorContainer,
  },
  aqua: {
    color: switchColor(colorMode).extended.aqua.color,
    background: switchColor(colorMode).extended.aqua.colorContainer,
  },
  sun: {
    color: switchColor(colorMode).extended.sun.color,
    background: switchColor(colorMode).extended.sun.colorContainer,
  },
  grass: {
    color: switchColor(colorMode).extended.grass.color,
    background: switchColor(colorMode).extended.grass.colorContainer,
  },
});
