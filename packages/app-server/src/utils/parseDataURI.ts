export function parseDataURI(uri: string) {
  const [metadata, stringData] = uri.split(/,/);

  const [contentType, ...metadataParts] = metadata
    .replace(/^data:/, '')
    .split(/;/g);

  const encoding = metadataParts.pop();
  const data = Buffer.from(
    stringData,
    encoding === 'base64' ? 'base64' : 'binary',
  );

  return {
    contentType,
    data,
  };
}
