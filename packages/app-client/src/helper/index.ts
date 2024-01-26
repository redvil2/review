import Decimal from 'decimal.js';

/**
 * @description Formats a numeric amount by adding delimiters for readability.
 *
 * @param {number|string} amt - The amount to be formatted with delimiters.
 * @returns {string} The formatted amount with delimiters.
 *
 * @function addDelimiter
 */
export const addDelimiter = amt => {
  if (amt) {
    return amt
      .toString()
      .replace(/\D/g, '')
      .split('')
      .reverse()
      .filter(char => char !== '.')
      .map((char, idx, arr) => {
        if ((idx + 1) % 3 === 0 && idx < arr.length - 1) {
          return `.${char}`;
        } else {
          return char;
        }
      })
      .reverse()
      .join('');
  }
  return amt;
};

/**
 * @description Converts a formatted amount string by removing delimiters and converting it to a number.
 *
 * @param {number|string} amt - The amount string with delimiters to be converted back to a number.
 * @returns {number} The numeric value of the input with delimiters removed.
 *
 * @function removeDelimiter
 */
export const removeDelimiter = amt => {
  if (amt) {
    const result = amt.toString().replace(/\./g, '');
    return Number(result);
  }
  return amt;
};

/**
 * @description Calculates 10% more than the given amount, optionally formats the result with delimiters.
 *
 * @param {number|string} amt - The original amount to be increased by 10%.
 * @param {boolean} [withDelimiter=false] - Flag to determine if the resulting amount should be formatted with delimiters.
 * @returns {string|Decimal} The calculated amount with a 10% increase, returned as a string if `withDelimiter` is true,
 * or as a Decimal object otherwise.
 *
 * @function add10Percent
 */
export const add10Percent = (amt, withDelimiter = false) => {
  const result = new Decimal(amt).times(1.1).ceil();
  if (withDelimiter) {
    return addDelimiter(result);
  }
  return result;
};
