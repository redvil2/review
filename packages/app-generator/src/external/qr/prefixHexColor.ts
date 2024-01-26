export function prefixHexColor(colorStr?: string) {
  if (!colorStr) return 'transparent';
  /* ToDo this quick fix should be replaced with proper color storage by frontend or using something like tinycolor */
  const hexColorRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;
  const namedColorRegex =
    /^(aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow|transparent)$/i;
  if (namedColorRegex.test(colorStr)) {
    return colorStr;
  } else if (hexColorRegex.test(colorStr)) {
    return '#' + colorStr.replace(/^#/, '');
  } else {
    throw new Error('Invalid color');
  }
}
