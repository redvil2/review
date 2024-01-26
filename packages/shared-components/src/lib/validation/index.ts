export const validateUrl = (value: string) => {
  if (!/^http(s)?:\/\//.exec(value))
    return 'URL must start with http:// or https://';
  if (!/^http(s)?:\/\/../.exec(value)) return 'URL must have a valid hostname';
  return undefined;
};
