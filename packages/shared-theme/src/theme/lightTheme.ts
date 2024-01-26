import colors from './colors';

export default {
  // primary
  primary: colors.primary['40'],
  onPrimary: colors.primary['100'],
  primaryContainer: colors.primary['90'],
  onPrimaryContainer: colors.primary['10'],
  primaryHover: colors.primary['20'],
  primaryActive: colors.primary['10'],
  // secondary
  secondary: colors.secondary['40'],
  onSecondary: colors.secondary['100'],
  secondaryContainer: colors.secondary['90'],
  onSecondaryContainer: colors.secondary['10'],
  // tertiary
  tertiary: colors.tertiary['40'],
  onTertiary: colors.tertiary['100'],
  tertiaryContainer: colors.tertiary['90'],
  onTertiaryContainer: colors.tertiary['10'],
  // error
  error: colors.error['40'],
  onError: colors.error['100'],
  errorContainer: colors.error['90'],
  onErrorContainer: colors.error['10'],
  // neutral
  outline: colors.neutralVariant['50'],
  background: colors.surfaceLight,
  onBackground: colors.surfaceDark,
  // surface
  surface: colors.surfaceLight,
  surface1: colors.surface.l1,
  surface2: colors.surface.l2,
  surface3: colors.surface.l3,
  surface4: colors.surface.l4,
  surface5: colors.surface.l5,
  onSurface: colors.surfaceDark,
  surfaceVariant: colors.neutralVariant['90'],
  onSurfaceVariant: colors.neutralVariant['30'],
  inverseSurface: colors.neutralVariant['20'],
  inverseOnSurface: colors.neutral['95'],
  inversePrimary: colors.primary['80'],
  shadow: colors.black,
  surfaceTint: colors.primary['40'],
  outlineVariant: colors.neutralVariant['80'],
  scrim: colors.black,
  plain: colors.white,
  // extended
  extended: {
    aqua: {
      color: colors.aqua['40'],
      onColor: colors.aqua['100'],
      colorContainer: colors.aqua['90'],
      onColorContainer: colors.aqua['10'],
    },
    grass: {
      color: colors.grass['40'],
      onColor: colors.grass['100'],
      colorContainer: colors.grass['90'],
      onColorContainer: colors.grass['10'],
    },
    sun: {
      color: colors.sun['40'],
      onColor: colors.sun['100'],
      colorContainer: colors.sun['90'],
      onColorContainer: colors.sun['10'],
    },
    clay: {
      color: colors.clay['40'],
      onColor: colors.clay['100'],
      colorContainer: colors.clay['90'],
      onColorContainer: colors.clay['10'],
    },
    ocean: {
      color: colors.ocean['40'],
      onColor: colors.ocean['100'],
      colorContainer: colors.ocean['90'],
      onColorContainer: colors.ocean['10'],
    },
  },
};
