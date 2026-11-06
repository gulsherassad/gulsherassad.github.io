/** Zero-pads a number to two digits: 5 → "05". */
export const pad = (n) => String(n).padStart(2, '0');
