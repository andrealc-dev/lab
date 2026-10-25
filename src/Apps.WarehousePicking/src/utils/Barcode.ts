const supportedLengths = new Set([8, 12, 13]);

export function eanError(value: string): string | undefined {
  const barcode = value.trim();
  if (!/^\d+$/.test(barcode) || !supportedLengths.has(barcode.length)) {
    return "Enter a valid 8, 12, or 13 digit barcode.";
  }

  const digits = Array.from(barcode, Number);
  const checkDigit = digits.pop();
  const weightedSum = digits
    .slice()
    .reverse()
    .reduce((sum, digit, index) => sum + digit * (index % 2 === 0 ? 3 : 1), 0);

  if ((10 - (weightedSum % 10)) % 10 !== checkDigit) {
    return "The barcode checksum is invalid.";
  }

  return undefined;
}