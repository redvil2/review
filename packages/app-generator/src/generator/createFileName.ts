export function createFileName({ amount, index, format }) {
  const maxFileNameLength = amount.toString().length;

  const formattedCounter = String(index + 1).padStart(maxFileNameLength, '0');

  return `${formattedCounter}.${format}`;
}
