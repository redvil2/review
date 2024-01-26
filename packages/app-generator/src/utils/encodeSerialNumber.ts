export function encodeSerialNumber(index) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(index, 0);
  return buffer
    .toString('base64')
    .replace(/^A*/, '')
    .replace(/=*$/, '')
    .replace(/\+/g, '_')
    .replace(/\//g, '-')
    .padStart(3, 'A');
}
