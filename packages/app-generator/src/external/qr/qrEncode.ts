import { QRCodeCanvas } from '@loskir/styled-qr-code-node';

import { QRStyling, getStyleOptions } from './getStyleOptions';

export type QREncodeOptions = {
  url: string;
  styling: QRStyling;
  image?: string | Buffer;
};

export function qrEncode({ url, styling, image }: QREncodeOptions) {
  const { shape } = styling;
  const size = shape === 'ROUND' ? 600 : 300;

  return new QRCodeCanvas({
    data: url,
    margin: 5,
    width: size,
    height: size,
    image,
    ...getStyleOptions(styling),
  });
}
