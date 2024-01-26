import type { Shape } from '@app/prisma';
import { Options as QRCodeCanvasOptions } from '@loskir/styled-qr-code-node';

import { prefixHexColor } from './prefixHexColor';

export type QRStyling = {
  shape: Shape;
  foreground?: string;
  background?: string;
};

export function getStyleOptions(
  options: QRStyling,
): Pick<
  QRCodeCanvasOptions,
  | 'dotsOptions'
  | 'cornersDotOptions'
  | 'cornersSquareOptions'
  | 'backgroundOptions'
> {
  const { foreground, background, shape } = options;

  return {
    dotsOptions: {
      type: shape === 'ROUND' ? 'dots' : 'square',
      color: prefixHexColor(foreground),
    },
    cornersSquareOptions: {
      type: shape === 'ROUND' ? 'extra-rounded' : 'square',
      color: prefixHexColor(foreground),
    },
    cornersDotOptions: {
      type: shape === 'ROUND' ? 'dot' : 'square',
      color: prefixHexColor(foreground),
    },
    backgroundOptions: {
      color: prefixHexColor(background),
    },
  };
}
