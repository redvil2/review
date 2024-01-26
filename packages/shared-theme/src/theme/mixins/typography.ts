import { EnumValues } from '@app/shared/type-util';

export const FONT_WEIGHT = {
  REGULAR: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
};

export type FontWeight = EnumValues<typeof FONT_WEIGHT>;

export const display1 = (fontWeight: FontWeight = FONT_WEIGHT.REGULAR) => ({
  fontFamily: 'Jost',
  fontSize: '4.5rem',
  lineHeight: '5.625rem',
  fontWeight,
});

export const display2 = (fontWeight: FontWeight = FONT_WEIGHT.REGULAR) => ({
  fontFamily: 'Jost',
  fontSize: '3.75rem',
  lineHeight: '4.5rem',
  fontWeight,
});

export const headline1 = (fontWeight: FontWeight = FONT_WEIGHT.REGULAR) => ({
  fontFamily: 'Jost',
  fontSize: '3rem',
  lineHeight: '3.75rem',
  fontWeight,
});

export const headline2 = (fontWeight: FontWeight = FONT_WEIGHT.REGULAR) => ({
  fontFamily: 'Jost',
  fontSize: '2.25rem',
  lineHeight: '2.75rem',
  fontWeight,
});

export const headline3 = (fontWeight: FontWeight = FONT_WEIGHT.REGULAR) => ({
  fontFamily: 'Jost',
  fontSize: '1.875rem',
  lineHeight: '2rem',
  fontWeight,
});

export const headline4 = (fontWeight: FontWeight = FONT_WEIGHT.REGULAR) => ({
  fontFamily: 'Jost',
  fontSize: '1.5rem',
  lineHeight: '2rem',
  fontWeight,
});

export const subline1 = (fontWeight: FontWeight = FONT_WEIGHT.REGULAR) => ({
  fontFamily: 'Jost',
  fontSize: '1.25rem',
  lineHeight: '1.875rem',
  fontWeight,
});

export const subline2 = (fontWeight: FontWeight = FONT_WEIGHT.REGULAR) => ({
  fontFamily: 'Jost',
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  fontWeight,
});

export const paragraph1 = (fontWeight: FontWeight = FONT_WEIGHT.REGULAR) => ({
  fontFamily: 'Jost',
  fontSize: '1rem',
  lineHeight: '1.5rem',
  fontWeight,
});

export const paragraph2 = (fontWeight: FontWeight = FONT_WEIGHT.REGULAR) => ({
  fontFamily: 'Jost',
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  fontWeight,
});

export const micro = (fontWeight: FontWeight = FONT_WEIGHT.REGULAR) => ({
  fontFamily: 'Jost',
  fontSize: '0.75rem',
  lineHeight: '1.125rem',
  fontWeight,
});
