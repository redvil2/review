import { QREncodeOptions, qrEncode } from '../external/qr/qrEncode';
import { encodeSerialNumber } from '../utils/encodeSerialNumber';

import { createFileName } from './createFileName';

export type GenerationRequest = QREncodeOptions & {
  amount: number;
  offset: number;
  threads: number;
  baseDir: string;
  format: 'png' | 'svg' | 'pdf';
  onCreation?: (sn: string) => void;
};

export async function produceShare({
  amount,
  offset,
  threads,
  url,
  format,
  image,
  styling,
  baseDir,
  onCreation,
}: GenerationRequest) {
  for (let i = offset; i < amount; i += threads) {
    const fileName = createFileName({ amount, index: i, format });
    const serialNumber = encodeSerialNumber(i);
    const fullUrl = `${url}/${serialNumber}`;

    const qr = qrEncode({
      url: fullUrl,
      image,
      styling,
    });

    await qr.toFile(`${baseDir}/${fileName}`, format);

    if (onCreation) {
      onCreation(serialNumber);
    }
  }
}
