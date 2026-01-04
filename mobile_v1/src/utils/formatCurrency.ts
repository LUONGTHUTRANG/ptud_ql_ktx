/**
 * Format currency value for display
 * Removes decimal part if it's .00, and separates thousands with dots
 * Example: 3000000 => 3.000.000 VND
 * Example: 3000000.50 => 3.000.000,50 VND
 * @param value - The numeric value to format
 * @param currency - Currency symbol (default: "VND")
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number | string,
  currency: string = "VND"
): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return `0 ${currency}`;
  }

  // Check if the number has decimal part
  const hasDecimal = numValue % 1 !== 0;
  let formatted: string;

  if (hasDecimal) {
    // If has decimal, format with 2 decimal places
    formatted = numValue
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") // Add dots as thousands separator
      .replace(".", ","); // Replace the last dot with comma for decimal separator
  } else {
    // If no decimal or decimal is .00, just format as integer
    formatted = Math.floor(numValue)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots as thousands separator
  }

  return `${formatted} ${currency}`;
};

/**
 * Format currency without currency symbol
 * Example: 3000000 => 3.000.000
 * @param value - The numeric value to format
 * @returns Formatted currency string without symbol
 */
export const formatCurrencyWithoutSymbol = (value: number | string): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "0";
  }

  const hasDecimal = numValue % 1 !== 0;
  let formatted: string;

  if (hasDecimal) {
    formatted = numValue
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") // Add dots as thousands separator
      .replace(".", ","); // Replace the last dot with comma for decimal separator
  } else {
    formatted = Math.floor(numValue)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots as thousands separator
  }

  return formatted;
};
